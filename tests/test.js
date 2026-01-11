/**
 * Pharmacy SOP Generator - Test Suite
 * Unit tests for validation, storage, and SOPLoader modules
 * @version 2.0.0
 * 
 * Usage: Open test.html in browser with developer console
 */

// Simple test framework
const TestRunner = {
  passed: 0,
  failed: 0,
  tests: [],
  
  assert(condition, message) {
    if (condition) {
      this.passed++;
      console.log(`✓ ${message}`);
      return true;
    } else {
      this.failed++;
      console.error(`✗ ${message}`);
      return false;
    }
  },
  
  assertEqual(actual, expected, message) {
    const condition = JSON.stringify(actual) === JSON.stringify(expected);
    this.assert(condition, `${message} - Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`);
  },
  
  run(testName, testFn) {
    console.log(`
🧪 Running: ${testName}`);
    try {
      testFn();
    } catch (error) {
      this.failed++;
      console.error(`✗ ${testName} FAILED with error:`, error);
    }
  },
  
  summary() {
    console.log(`
${'='.repeat(60)}`);
    console.log(`TEST SUMMARY`);
    console.log(`${'='.repeat(60)}`);
    console.log(`✓ Passed: ${this.passed}`);
    console.log(`✗ Failed: ${this.failed}`);
    console.log(`Total: ${this.passed + this.failed}`);
    console.log(`Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(2)}%`);
  }
};

// ========== VALIDATION MODULE TESTS ==========

TestRunner.run('ValidationModule - Valid SOP Data', () => {
  const validData = {
    title: 'Test SOP Title',
    metadata: {
      sopNumber: 'SOP001',
      effectiveDate: '2026-01-01'
    },
    sections: {
      purpose: 'This is a test purpose that is more than 20 characters long',
      scope: 'This is a test scope that is more than 20 characters long',
      procedure: 'This is a test procedure that is more than 30 characters long'
    }
  };
  
  const result = ValidationModule.validateSOP(validData);
  TestRunner.assert(result.isValid, 'Valid SOP data should pass validation');
  TestRunner.assertEqual(result.errors.length, 0, 'Should have zero errors');
});

TestRunner.run('ValidationModule - Missing Title', () => {
  const invalidData = {
    title: '',
    metadata: { sopNumber: 'SOP001', effectiveDate: '2026-01-01' },
    sections: {
      purpose: 'Valid purpose text here that meets minimum length',
      scope: 'Valid scope text here that meets minimum length',
      procedure: 'Valid procedure text here that meets minimum length'
    }
  };
  
  const result = ValidationModule.validateSOP(invalidData);
  TestRunner.assert(!result.isValid, 'Missing title should fail validation');
  TestRunner.assert(result.errors.length > 0, 'Should have at least one error');
});

TestRunner.run('ValidationModule - JSON Structure Validation', () => {
  const validJSON = {
    meta: { title: 'Test' },
    sections: { purpose: 'Test purpose' }
  };
  
  const invalidJSON = {
    meta: { title: 'Test' }
    // Missing sections
  };
  
  TestRunner.assert(ValidationModule.validateJSONStructure(validJSON), 'Valid JSON structure should pass');
  TestRunner.assert(!ValidationModule.validateJSONStructure(invalidJSON), 'Invalid JSON structure should fail');
});

TestRunner.run('ValidationModule - Date Validation', () => {
  TestRunner.assert(ValidationModule.validateDate('2026-01-11'), 'Valid date should pass');
  TestRunner.assert(!ValidationModule.validateDate('2026/01/11'), 'Invalid date format should fail');
  TestRunner.assert(!ValidationModule.validateDate('invalid'), 'Invalid date string should fail');
  TestRunner.assert(!ValidationModule.validateDate(''), 'Empty date should fail');
});

// ========== STORAGE MODULE TESTS ==========

TestRunner.run('StorageModule - Availability Check', () => {
  const isAvailable = StorageModule.isAvailable();
  TestRunner.assert(typeof isAvailable === 'boolean', 'Should return boolean');
  console.log(`   ℹ localStorage available: ${isAvailable}`);
});

TestRunner.run('StorageModule - Save and Load', () => {
  if (StorageModule.isAvailable()) {
    const testData = {
      title: 'Test SOP',
      sopMode: 'predefined'
    };
    
    const saveResult = StorageModule.save(testData);
    TestRunner.assert(saveResult, 'Should save data successfully');
    
    const loadedData = StorageModule.load();
    TestRunner.assert(loadedData !== null, 'Should load data successfully');
    TestRunner.assertEqual(loadedData.title, testData.title, 'Loaded title should match saved title');
    TestRunner.assertEqual(loadedData.sopMode, testData.sopMode, 'Loaded mode should match saved mode');
    TestRunner.assert(loadedData.savedAt !== undefined, 'Should include savedAt timestamp');
    
    // Cleanup
    StorageModule.clear();
  } else {
    console.log('   ⚠ Skipping storage tests - localStorage not available');
  }
});

TestRunner.run('StorageModule - Recent Data Check', () => {
  const recentData = {
    savedAt: new Date().toISOString()
  };
  
  const oldData = {
    savedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() // 25 hours ago
  };
  
  TestRunner.assert(StorageModule.isRecent(recentData), 'Recent data should be identified as recent');
  TestRunner.assert(!StorageModule.isRecent(oldData), 'Old data should not be identified as recent');
});

TestRunner.run('StorageModule - Time Formatting', () => {
  const now = new Date();
  const oneHourAgo = new Date(now - 60 * 60 * 1000);
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
  
  const timeAgo1 = StorageModule.formatTimeAgo(oneHourAgo);
  const timeAgo2 = StorageModule.formatTimeAgo(oneDayAgo);
  
  TestRunner.assert(timeAgo1.includes('hour'), 'Should format hours correctly');
  TestRunner.assert(timeAgo2.includes('day'), 'Should format days correctly');
});

// ========== UTILITY FUNCTIONS TESTS ==========

TestRunner.run('escapeHTML - XSS Prevention', () => {
  const dangerous = '<script>alert("XSS")</script>';
  const escaped = escapeHTML(dangerous);
  
  TestRunner.assert(!escaped.includes('<script>'), 'Should escape script tags');
  TestRunner.assert(escaped.includes('&lt;'), 'Should contain escaped less-than');
  TestRunner.assert(escaped.includes('&gt;'), 'Should contain escaped greater-than');
});

TestRunner.run('sanitizeText - DOM-based Sanitization', () => {
  const dangerous = '<img src=x onerror=alert("XSS")>';
  const sanitized = sanitizeText(dangerous);
  
  TestRunner.assert(!sanitized.includes('onerror'), 'Should remove event handlers');
  console.log(`   ℹ Sanitized output: ${sanitized}`);
});

TestRunner.run('today - Date Format', () => {
  const todayDate = today();
  const dateRegex = /^d{4}-d{2}-d{2}$/;
  
  TestRunner.assert(dateRegex.test(todayDate), 'Should return date in YYYY-MM-DD format');
  console.log(`   ℹ Today's date: ${todayDate}`);
});

TestRunner.run('debounce - Function Debouncing', (done) => {
  let callCount = 0;
  const debouncedFn = debounce(() => { callCount++; }, 100);
  
  // Call multiple times rapidly
  debouncedFn();
  debouncedFn();
  debouncedFn();
  
  // Should only execute once after delay
  setTimeout(() => {
    TestRunner.assertEqual(callCount, 1, 'Debounced function should execute only once');
  }, 150);
});

// ========== CONFIG TESTS ==========

TestRunner.run('CONFIG - Immutability', () => {
  const originalValue = CONFIG.APP_NAME;
  
  try {
    CONFIG.APP_NAME = 'Modified';
    // If frozen, assignment will fail silently in non-strict mode
    TestRunner.assertEqual(CONFIG.APP_NAME, originalValue, 'CONFIG should be immutable');
  } catch (e) {
    TestRunner.assert(true, 'CONFIG is properly frozen');
  }
});

TestRunner.run('CONFIG - Structure Validation', () => {
  TestRunner.assert(CONFIG.APP_NAME !== undefined, 'Should have APP_NAME');
  TestRunner.assert(CONFIG.VERSION !== undefined, 'Should have VERSION');
  TestRunner.assert(CONFIG.VALIDATION !== undefined, 'Should have VALIDATION object');
  TestRunner.assert(CONFIG.DEPARTMENTS.length > 0, 'Should have departments array');
  TestRunner.assert(CONFIG.AUTO_SAVE_INTERVAL > 0, 'Should have auto-save interval');
});

// ========== INTEGRATION TESTS ==========

TestRunner.run('Integration - Complete SOP Workflow', () => {
  // 1. Create SOP data
  const sopData = {
    title: 'Integration Test SOP',
    metadata: {
      sopNumber: 'INT001',
      effectiveDate: today()
    },
    sections: {
      purpose: 'This is a comprehensive integration test purpose',
      scope: 'This scope covers all integration testing scenarios',
      procedure: 'Step 1: Initialize
Step 2: Validate
Step 3: Save'
    }
  };
  
  // 2. Validate
  const validation = ValidationModule.validateSOP(sopData);
  TestRunner.assert(validation.isValid, 'SOP should pass validation');
  
  // 3. Save to storage
  if (StorageModule.isAvailable()) {
    const saved = StorageModule.save(sopData);
    TestRunner.assert(saved, 'Should save to storage');
    
    // 4. Load from storage
    const loaded = StorageModule.load();
    TestRunner.assert(loaded !== null, 'Should load from storage');
    TestRunner.assertEqual(loaded.title, sopData.title, 'Loaded data should match saved data');
    
    // 5. Cleanup
    StorageModule.clear();
  }
});

// Run summary
TestRunner.summary();

// Export test results for CI/CD
window.TEST_RESULTS = {
  passed: TestRunner.passed,
  failed: TestRunner.failed,
  total: TestRunner.passed + TestRunner.failed,
  success: TestRunner.failed === 0
};