const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    //khóa liên kết
    instructorID: { type: Schema.Types.ObjectId, ref: 'Customer' },
    // Lưu nội dung course nhập được vào đây
    // Chú ý những cái nào là đa thì lưu theo dạng mảng
    //     thông tin mỗi khóa học
    // + Tên khóa học ( đơn )
    // +  mô tả Khóa học ( đơn )
    // + Đối tượng của khóa học hướng đến ( khóa học dành cho ai ) ( dơn)
    // + Bạn sẽ học được những gì (đa )
    // +Yêu cầu về cần chuẩn bị hay ghi chép gì đó (đa)
    // còn lại giữ như nãy tui nói

    // lession: { type: [String]},

    createdAt: { type: String, default: new Date().toUTCString() }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
