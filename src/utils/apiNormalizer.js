/**
 * API Response Normalizer
 * 
 * Handles inconsistent API response structures across the application
 * Provides consistent data extraction regardless of backend response format
 */

/**
 * Extract array data from API response
 * Handles multiple possible response structures:
 * - { success: true, data: [...] }
 * - { success: true, rooms: [...] }
 * - { success: true, uploads: [...] }
 * - [...]
 * 
 * @param {Object} response - Axios response object
 * @param {string} dataKey - Expected data key (e.g., 'rooms', 'uploads', 'users')
 * @returns {Array} Normalized array data
 */
export function extractArrayData(response, dataKey = 'data') {
  if (!response || !response.data) {
    console.warn(`[API NORMALIZE] No response data for key: ${dataKey}`);
    return [];
  }

  const responseData = response.data;

  // Try specific key first (e.g., 'rooms', 'uploads')
  if (responseData[dataKey] && Array.isArray(responseData[dataKey])) {
    return responseData[dataKey];
  }

  // Try generic 'data' key
  if (responseData.data && Array.isArray(responseData.data)) {
    return responseData.data;
  }

  // Try 'files' key (for uploads)
  if (responseData.files && Array.isArray(responseData.files)) {
    return responseData.files;
  }

  // Try 'items' key
  if (responseData.items && Array.isArray(responseData.items)) {
    return responseData.items;
  }

  // If response itself is an array
  if (Array.isArray(responseData)) {
    return responseData;
  }

  // If response.data.success is true but no array found, return empty
  if (responseData.success === false) {
    console.warn(`[API NORMALIZE] API returned success=false for ${dataKey}`);
    return [];
  }

  console.warn(`[API NORMALIZE] Could not extract array for ${dataKey}`, responseData);
  return [];
}

/**
 * Extract object data from API response
 * 
 * @param {Object} response - Axios response object
 * @param {string} dataKey - Expected data key
 * @returns {Object} Normalized object data
 */
export function extractObjectData(response, dataKey = 'data') {
  if (!response || !response.data) {
    console.warn(`[API NORMALIZE] No response data for key: ${dataKey}`);
    return {};
  }

  const responseData = response.data;

  // Try specific key first
  if (responseData[dataKey] && typeof responseData[dataKey] === 'object') {
    return responseData[dataKey];
  }

  // Try generic 'data' key
  if (responseData.data && typeof responseData.data === 'object') {
    return responseData.data;
  }

  // Return the whole response if it's an object (excluding success flag)
  const { success, message, ...rest } = responseData;
  if (Object.keys(rest).length > 0) {
    return rest;
  }

  return {};
}

/**
 * Extract stats data from API response
 * Specifically for statistics/count endpoints
 * 
 * @param {Object} response - Axios response object
 * @returns {Object} Normalized stats object
 */
export function extractStatsData(response) {
  if (!response || !response.data) {
    return { total: 0, count: 0 };
  }

  const responseData = response.data;

  // Try 'stats' key
  if (responseData.stats) {
    return responseData.stats;
  }

  // Try 'data' key
  if (responseData.data) {
    return responseData.data;
  }

  // Extract known stat fields
  return {
    total: responseData.total || 0,
    count: responseData.count || 0,
    totalSize: responseData.totalSize || 0,
    totalSizeFormatted: responseData.totalSizeFormatted || '0 Bytes',
    ...responseData
  };
}

/**
 * Check if API response indicates success
 * 
 * @param {Object} response - Axios response object
 * @returns {boolean}
 */
export function isSuccessResponse(response) {
  if (!response || !response.data) {
    return false;
  }

  // Check success flag
  if (response.data.success === true) {
    return true;
  }

  // Check HTTP status
  if (response.status >= 200 && response.status < 300) {
    return true;
  }

  return false;
}

/**
 * Extract error message from API response
 * 
 * @param {Object} error - Axios error object
 * @returns {string}
 */
export function extractErrorMessage(error) {
  if (!error) {
    return 'An unknown error occurred';
  }

  // Check response error message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Check error message
  if (error.message) {
    return error.message;
  }

  // Network error
  if (error.request && !error.response) {
    return 'Network error - please check your connection';
  }

  return 'An error occurred while processing your request';
}

/**
 * Comprehensive API response handler
 * Use this for complete error handling + data extraction
 * 
 * @param {Promise} apiCall - Axios promise
 * @param {string} dataKey - Expected data key
 * @param {Object} options - Options { defaultValue, isArray }
 * @returns {Promise<Object>} { success, data, error }
 */
export async function handleApiCall(apiCall, dataKey = 'data', options = {}) {
  const { defaultValue = null, isArray = true } = options;

  try {
    const response = await apiCall;

    if (!isSuccessResponse(response)) {
      return {
        success: false,
        data: defaultValue !== null ? defaultValue : (isArray ? [] : {}),
        error: extractErrorMessage({ response })
      };
    }

    const data = isArray 
      ? extractArrayData(response, dataKey)
      : extractObjectData(response, dataKey);

    return {
      success: true,
      data,
      error: null
    };
  } catch (error) {
    console.error(`[API CALL] Error for ${dataKey}:`, error);
    
    return {
      success: false,
      data: defaultValue !== null ? defaultValue : (isArray ? [] : {}),
      error: extractErrorMessage(error)
    };
  }
}

export default {
  extractArrayData,
  extractObjectData,
  extractStatsData,
  isSuccessResponse,
  extractErrorMessage,
  handleApiCall
};
