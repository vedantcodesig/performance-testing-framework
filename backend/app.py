from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import pandas as pd
from datetime import datetime, timedelta
import random
import logging

# Set up logging - like a black box recorder for our app
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create our Flask application - this is the main "engine"
app = Flask(__name__)
CORS(app)  # Allows our frontend to talk to backend

# Temporary data storage (in real app, we'd use a database)
performance_data = []
test_plan = []
optimization_data = []

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint - like a heartbeat monitor"""
    return jsonify({
        'status': 'healthy', 
        'timestamp': datetime.now().isoformat(),
        'service': 'CI/CD Performance Suite Backend'
    })

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get overall dashboard statistics - main dashboard data"""
    try:
        # Generate realistic-looking fake data for demonstration
        stats = {
            'performance': {
                'p95Latency': round(random.uniform(30, 60), 1),  # Response time in milliseconds
                'failureRate': round(random.uniform(0.1, 2.0), 2),  # Error percentage
                'totalTests': random.randint(50, 200),  # Number of tests run
                'throughput': random.randint(1000, 5000)  # Requests per second
            },
            'prioritization': {
                'apfdImprovement': round(random.uniform(30, 50), 1),  # How much better our AI is
                'prioritizedTests': random.randint(20, 100),  # Tests organized by AI
                'modelAccuracy': round(random.uniform(75, 92), 1)  # AI accuracy percentage
            },
            'optimization': {
                'resourceSavings': round(random.uniform(20, 30), 1),  # Money saved percentage
                'costSavings': round(random.uniform(100, 500), 2),  # Dollars saved
                'optimizedPods': random.randint(5, 20)  # Containers optimized
            },
            'pipeline': {
                'successRate': round(random.uniform(85, 95), 1),  # Build success rate
                'lastBuildStatus': 'success' if random.random() > 0.2 else 'failed',  # Latest build
                'activeBuilds': random.randint(0, 3)  # Currently running builds
            }
        }
        logger.info("Dashboard stats requested")
        return jsonify(stats)
    except Exception as e:
        logger.error(f"Error generating dashboard stats: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/performance/tests', methods=['GET'])
def get_performance_tests():
    """Get performance test history"""
    try:
        tests = []
        statuses = ['completed', 'running', 'failed']
        
        # Generate 10 sample test records
        for i in range(10):
            test_status = random.choice(statuses)
            p95_latency = round(random.uniform(20, 80), 1)  # 95th percentile response time
            failure_rate = round(random.uniform(0.1, 5.0), 2)  # Failure percentage
            
            tests.append({
                'id': f'test_{i}',
                'name': f'Load Test {i+1}',
                'status': test_status,
                'users': random.randint(10, 500),  # Simulated users
                'duration': f'{random.randint(1, 10)}m',  # Test duration
                'p95Latency': p95_latency,
                'failureRate': failure_rate,
                'slaStatus': 'PASS' if p95_latency <= 50 and failure_rate <= 1.0 else 'FAIL',  # Service Level Agreement
                'timestamp': (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat()
            })
        
        logger.info("Performance tests history requested")
        return jsonify(tests)
    except Exception as e:
        logger.error(f"Error fetching performance tests: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/performance/start', methods=['POST'])
def start_performance_test():
    """Start a new performance test"""
    try:
        config = request.json  # Get configuration from frontend
        test_id = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}"  # Unique ID
        
        # Create test record
        test_data = {
            'id': test_id,
            'name': config.get('name', 'Unknown Test'),
            'status': 'running',
            'startTime': datetime.now().isoformat(),
            'config': config,
            'users': config.get('users', 100),
            'duration': config.get('duration', '5m')
        }
        
        performance_data.append(test_data)
        logger.info(f"Performance test started: {test_id}")
        
        return jsonify({
            'status': 'started', 
            'testId': test_id,
            'message': f"Test {config.get('name')} started successfully"
        })
    except Exception as e:
        logger.error(f"Error starting performance test: {e}")
        return jsonify({'error': 'Failed to start test'}), 500

@app.route('/api/performance/stop', methods=['POST'])
def stop_performance_test():
    """Stop current performance test"""
    try:
        # Find and stop running tests
        for test in performance_data:
            if test.get('status') == 'running':
                test['status'] = 'completed'
                test['endTime'] = datetime.now().isoformat()
                # Generate realistic results
                test['p95Latency'] = round(random.uniform(25, 55), 1)
                test['failureRate'] = round(random.uniform(0.1, 1.5), 2)
        
        logger.info("Performance test stopped")
        return jsonify({'status': 'stopped', 'message': 'All tests stopped successfully'})
    except Exception as e:
        logger.error(f"Error stopping performance test: {e}")
        return jsonify({'error': 'Failed to stop test'}), 500

@app.route('/api/performance/results/<test_id>', methods=['GET'])
def get_test_results(test_id):
    """Get detailed test results for a specific test"""
    try:
        results = {
            'testId': test_id,
            'p95Latency': round(random.uniform(25, 55), 1),
            'failureRate': round(random.uniform(0.1, 1.5), 2),
            'totalRequests': random.randint(10000, 50000),
            'slaStatus': 'PASS' if random.random() > 0.3 else 'FAIL',
            'responseTimes': {
                'min': round(random.uniform(10, 20), 1),
                'max': round(random.uniform(80, 150), 1),
                'median': round(random.uniform(25, 40), 1),
                'average': round(random.uniform(30, 45), 1)
            },
            'throughput': random.randint(800, 2000),  # Requests per second
            'users': random.randint(50, 200),
            'duration': f'{random.randint(2, 10)}m'
        }
        
        logger.info(f"Test results requested for: {test_id}")
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error fetching test results: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# Add more endpoints for other features...
@app.route('/api/prioritization/data', methods=['GET'])
def get_prioritization_data():
    """Get test prioritization AI data"""
    try:
        features = ['changed_files', 'additions', 'deletions', 'author_experience', 
                   'is_bug_fix', 'is_weekend', 'commit_hour', 'test_complexity']
        
        feature_importance = []
        for feature in features:
            feature_importance.append({
                'feature': feature.replace('_', ' ').title(),  # Pretty names
                'importance': round(random.uniform(0.05, 0.3), 3)  # How important for AI
            })
        
        # Sort by importance (most important first)
        feature_importance.sort(key=lambda x: x['importance'], reverse=True)
        
        data = {
            'apfdImprovement': round(random.uniform(35, 48), 1),  # Efficiency improvement
            'featureImportance': feature_importance,
            'totalCommitsAnalyzed': random.randint(100, 500),
            'modelType': 'Random Forest',  # Our AI algorithm
            'trainingSize': random.randint(1000, 5000)  # Data points used for training
        }
        
        logger.info("Prioritization data requested")
        return jsonify(data)
    except Exception as e:
        logger.error(f"Error fetching prioritization data: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/prioritization/test-plan', methods=['GET'])
def get_test_plan():
    """Get AI-prioritized test execution plan"""
    try:
        global test_plan
        if not test_plan:
            test_plan = []
            # Generate 50 sample tests with AI priorities
            for i in range(50):
                failure_prob = round(random.uniform(0.1, 0.9), 3)  # AI predicted failure probability
                risk_level = 'HIGH' if failure_prob > 0.7 else 'MEDIUM' if failure_prob > 0.4 else 'LOW'
                
                test_plan.append({
                    'id': f'test_{i}',
                    'testCase': f'Test API Endpoint {i+1}',
                    'failureProbability': failure_prob,
                    'priority': i + 1,  # AI-assigned priority (1 = run first)
                    'estimatedDuration': random.randint(5, 60),  # Seconds
                    'riskLevel': risk_level
                })
        
        # Sort by priority (most important tests first)
        test_plan.sort(key=lambda x: x['priority'])
        
        logger.info("Test plan requested")
        return jsonify(test_plan[:20])  # Return top 20 most important tests
    except Exception as e:
        logger.error(f"Error fetching test plan: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/optimization/data', methods=['GET'])
def get_optimization_data():
    """Get resource optimization recommendations"""
    try:
        optimizations = []
        # Generate optimization suggestions for 8 sample containers
        for i in range(8):
            current_cpu = random.randint(200, 800)  # Current CPU usage
            suggested_cpu = max(int(current_cpu * random.uniform(0.6, 0.8)), 100)  # AI suggested
            
            current_memory = random.randint(256, 1024)  # Current memory (MB)
            suggested_memory = max(int(current_memory * random.uniform(0.7, 0.85)), 128)  # AI suggested
            
            cpu_saving = current_cpu - suggested_cpu
            memory_saving = current_memory - suggested_memory
            
            optimizations.append({
                'pod': f'app-pod-{i}',
                'container': f'container-{i}',
                'namespace': 'default',
                'currentCpu': current_cpu,
                'suggestedCpu': suggested_cpu,
                'currentMemory': current_memory,
                'suggestedMemory': suggested_memory,
                'cpuSaving': cpu_saving,
                'memorySaving': memory_saving,
                'cpuSavingPercent': round((cpu_saving / current_cpu) * 100, 1),
                'memorySavingPercent': round((memory_saving / current_memory) * 100, 1)
            })
        
        logger.info("Optimization data requested")
        return jsonify(optimizations)
    except Exception as e:
        logger.error(f"Error fetching optimization data: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/pipeline/status', methods=['GET'])
def get_pipeline_status():
    """Get current CI/CD pipeline status"""
    try:
        status = {
            'lastBuild': {
                'id': f'build_{random.randint(1000, 9999)}',
                'status': 'success' if random.random() > 0.2 else 'failed',
                'duration': random.randint(120, 600),  # Seconds
                'timestamp': datetime.now().isoformat(),
                'triggeredBy': random.choice(['user@example.com', 'jenkins', 'webhook']),
                'pipeline': 'main'
            },
            'queueLength': random.randint(0, 5),  # Builds waiting
            'activeBuilds': random.randint(0, 2),  # Currently running
            'successRate': round(random.uniform(85, 95), 1)  # Historical success
        }
        
        logger.info("Pipeline status requested")
        return jsonify(status)
    except Exception as e:
        logger.error(f"Error fetching pipeline status: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info("Starting CI/CD Performance Suite Backend")
    # Start the server on all interfaces, port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)