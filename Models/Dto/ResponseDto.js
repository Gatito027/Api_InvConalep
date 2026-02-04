// src/Dto/ResponseDto.js
class ResponseDto {
    constructor(isSuccess = false, message = '', data = null) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.data = data;
    }
}

module.exports = ResponseDto;
