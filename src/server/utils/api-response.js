export function successResponse(data = {}, message = "Operation successful.", meta = {}) {
  return { success: true, message, data, meta };
}

export function errorResponse(message = "An error occurred.", errors = [], meta = {}) {
  return { success: false, message, errors, meta };
}
