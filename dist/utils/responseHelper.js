"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response = (res, code, status, data, resType) => {
    return res.status(code).json({
        status: status,
        [resType ? 'data' : 'message']: data
    });
};
exports.default = response;
//# sourceMappingURL=responseHelper.js.map