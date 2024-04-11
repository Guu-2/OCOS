// Thêm kết quả đạt được
document.getElementById('addResult').addEventListener('click', function () {
    var motaInput = document.getElementById('inputCourseResult').value.trim();
    if (motaInput !== '') {
        var li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = motaInput + '<button type="button" class="btn btn-danger btn-sm float-end delete-btn" style="display:none;">Remove</button>';
        document.getElementById('inputCourseResultList').appendChild(li);
        document.getElementById('inputCourseResult').value = '';

        // Hiển thị nút Xóa khi hover
        li.addEventListener('mouseenter', function () {
            li.querySelector('.delete-btn').style.display = 'inline-block';
        });

        // Ẩn nút Xóa khi rời khỏi
        li.addEventListener('mouseleave', function () {
            li.querySelector('.delete-btn').style.display = 'none';
        });

        // Xóa mô tả khi nhấn vào nút Xóa
        li.querySelector('.delete-btn').addEventListener('click', function () {
            li.remove();
        });
    }
});

// Thêm yêu cầu khóa học
document.getElementById('addReq').addEventListener('click', function () {
    var motaInput = document.getElementById('inputCourseReq').value.trim();
    if (motaInput !== '') {
        var li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = motaInput + '<button type="button" class="btn btn-danger btn-sm float-end delete-btn" style="display:none;">Remove</button>';
        document.getElementById('inputCourseReqList').appendChild(li);
        document.getElementById('inputCourseReq').value = '';

        // Hiển thị nút Xóa khi hover
        li.addEventListener('mouseenter', function () {
            li.querySelector('.delete-btn').style.display = 'inline-block';
        });

        // Ẩn nút Xóa khi rời khỏi
        li.addEventListener('mouseleave', function () {
            li.querySelector('.delete-btn').style.display = 'none';
        });

        // Xóa mô tả khi nhấn vào nút Xóa
        li.querySelector('.delete-btn').addEventListener('click', function () {
            li.remove();
        });
    }
});

function convertToSlug(text) {
    return text.toLowerCase().replace(/ /g, '');
}

// Thêm chương học + video bài giảng
const addChapterBtn = document.getElementById('addChapterBtn');
const addChapterForm = document.getElementById('addChapterForm');
const cancelChapterBtn = document.getElementById('cancelChapterBtn');
const confirmChapterBtn = document.getElementById('confirmChapterBtn');
const chaptersContainer = document.getElementById('chapters');
const confirmVideoBtn = document.getElementById('confirmVideoBtn');

addChapterBtn.addEventListener('click', () => {
    addChapterForm.classList.remove('d-none');
});

cancelChapterBtn.addEventListener('click', () => {
    addChapterForm.classList.add('d-none');
});

confirmChapterBtn.addEventListener('click', () => {
    const chapterName = document.getElementById('chapterName').value;
    const chapterTitle = document.getElementById('chapterTitle').value;
    addChapter(chapterName, chapterTitle);
    addChapterForm.classList.add('d-none');
});

function addChapter(name, title) {
    const chapterCard = document.createElement('div');
    chapterCard.classList.add('card', 'mt-3', 'chapter-card');
    chapterCard.innerHTML = `
    <div class="card-body">
        <h5 class="chapter-name card-title" contenteditable="true">${name}</h5>
        <h6 class="chapter-title card-subtitle mb-2 text-muted" contenteditable="true">${title}</h6>
        <div class="w-100 mb-3">
            <button class="btn btn-primary" onclick="showVideoForm('${name}')">New Lecture</button>
            <button class="btn btn-danger ms-2 float-end" onclick="deleteChapter(this)">Remove</button>
        </div>
        <div class="mt-3" id="videos-${convertToSlug(name).replace(/\s+/g, '-')}"></div>
    </div>
  `;
    chaptersContainer.appendChild(chapterCard);
}

function deleteChapter(button) {
    const chapterCard = button.closest('.chapter-card');
    chapterCard.remove();
}

function showVideoForm(chapterName) {
    const modal = new bootstrap.Modal(document.getElementById('videoModalCreate'));
    confirmVideoBtn.onclick = () => {
        const videoTitle = document.getElementById('videoTitle').value;
        const videoLink = document.getElementById('videoLink').value;
        const videoDesc = document.getElementById('videoDesc').value;
        addVideo(chapterName, videoTitle, videoLink, videoDesc);
        modal.hide();
    };
    modal.show();
    $('.modal-backdrop').remove();
}

function addVideo(chapterName, title, link, desc) {
    const videoContainer = document.getElementById(`videos-${convertToSlug(chapterName).replace(/\s+/g, '-')}`);
    videoContainer.innerHTML += `
        <div class="card mt-2 video-card">
            <div class="row">
                <div class="col-md-4">
                    <div class="embed-responsive embed-responsive-16by9">
                        <iframe class="embed-responsive-item" src="${link}" allowfullscreen></iframe>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h6 class="video-title card-title" contenteditable="true">${title}</h6>
                        <p class="video-desc card-text">${desc}</p>
                        <div class="w-100 mb-3">
                            <button class="btn btn-danger ms-2 float-end" onclick="deleteVideo(this)"">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  `;
}

function deleteVideo(button) {
    const videoCard = button.closest('.card');
    videoCard.remove();
}

// Thêm khóa học
document.getElementById('addCourseBtn').addEventListener('click', function () {
    var courseName = document.getElementById('inputCourseTitle').value.trim();
    var coursePrice = document.getElementById('inputCoursePrice').value.trim();
    var courseCategory = document.getElementById('inputCategory').value;
    var coursePreview = document.getElementById('inputCoursePreview').value.trim();
    var courseDescription = document.getElementById('inputCourseDescription').value.trim();
    var courseAudience = document.getElementById('inputCourseAudience').value.trim();

    var courseResultList = document.querySelectorAll('#inputCourseResultList li');
    var courseResult = [];
    courseResultList.forEach(function (item) {
        var textNodes = Array.from(item.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
        var result = textNodes.map(node => node.textContent.trim()).join('');
        courseResult.push(result);
    });

    var courseReqList = document.querySelectorAll('#inputCourseReqList li');
    var courseReq = [];
    courseReqList.forEach(function (item) {
        var textNodes = Array.from(item.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
        var req = textNodes.map(node => node.textContent.trim()).join('');
        courseReq.push(req);
    });

    var course = {
        "courseName": courseName,
        "coursePrice": parseInt(coursePrice),
        "courseCategory": courseCategory,
        "coursePreview": coursePreview,
        "courseDescription": courseDescription,
        "courseAudience": courseAudience,
        "courseResult": courseResult,
        "courseRequirement": courseReq,
        "sections": []
    };

    var chapters = document.querySelectorAll('#chapters .chapter-card');

    chapters.forEach(function (chapter) {
        var chapterName = chapter.querySelector('.chapter-name').textContent;
        var chapterTitle = chapter.querySelector('.chapter-title').textContent;

        var videos = chapter.querySelectorAll('.video-card');

        var chapterObj = {
            "sectionNumber": chapterName,
            "sectionTitle": chapterTitle,
            "lectures": []
        };

        videos.forEach(function (video) {
            var videoTitle = video.querySelector('.video-title').textContent;
            var videoLink = video.querySelector('iframe').src;
            var videoDesc = video.querySelector('.video-desc').textContent;

            var videoObj = {
                "lectureTitle": videoTitle,
                "lectureLink": videoLink,
                "lectureDescription": videoDesc
            };

            chapterObj["lectures"].push(videoObj);
        });

        course["sections"].push(chapterObj);
    });

    // Tạm thời in ra tab console
    console.log(JSON.stringify(course));

    // Gửi dữ liệu lên server bằng phương thức POST
    fetch('/home/course/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log('Course added successfully:', data);

            const successAlert = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Successfully!</strong> New course created.
                <button type="button" class="close btn" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                `;
            document.getElementById('alert-container').innerHTML = successAlert;
            // Đóng alert sau một thời gian
            $(".alert").alert();
        })
        .catch(error => {
            console.error('Error adding course:', error);

            const errorAlert = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Failed to create new course.
                <button type="button" class="close btn" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                `;
            document.getElementById('alert-container').innerHTML = errorAlert;
            // Đóng alert sau một thời gian
            $(".alert").alert();
        });
});