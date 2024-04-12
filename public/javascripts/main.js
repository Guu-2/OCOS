
const sidebar = document.querySelector(".sidebar"),

  show_card = document.querySelector(".show_card"),

  closeBtn = document.querySelector("#btn_sidebar"),

  open_course_card = document.querySelector(".course"),

  homeSection = document.querySelector('.home-section'),

  body = document.querySelector('.main_body'),

  mode = document.querySelector('.toggle_switch'),

  mode_text = document.querySelector('.mode_name'),

  log_out = document.querySelector('#confirm'),

  profile = document.querySelector(".profile-details"),

  offcanvasElement = document.getElementById('section_bar'),

  menuIcon = document.querySelector('.menu_icon'),



  // const curr_page = document.querySelector('.home-section');

  // open_course_card = document.querySelector(".course"),

  // order = document.querySelector(".order_card"),

  searchInput = document.getElementById('searchInput'),

  icon_seach = document.getElementById("seach_icon");



if (searchInput) {

  searchInput.addEventListener('keyup', function (event) {
    // if (event.key === 'Enter') {
    const keyword = searchInput.value.trim();
    if (keyword !== '') {
      sendData(keyword);
    }
    // }
  });
  icon_seach.addEventListener('click', function () {
    sendData(searchInput.value.trim());
  });

}

function sendData(term) {
  // console.log(term)
  fetch(`/home/search/${term}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then(list => {
      if (list.data) {
        // console.log(list);
        list = list.data
        var data = ""
        list.forEach((product) => {
          data +=
            `
            <tr class="product_row">
              <td>
                  <div class="product_picture">
                      <img src="../${product.productPicture}" alt="err">
                  </div>
              </td>
              <td>
                  <div >
                    ${product.productName}
                  </div>
              </td>
              <td>
                  <div>
                  ${product.retailPrice}
                  </div>
              </td>
              <td>
                  <div>
                  ${product.category}
                  </div>
              </td>
              <td>
                  <div>
                  ${product.inventory}
                     
                  </div>
              </td>
  
              <td>
                <button type="button" class="btn btn-success" data-product-id="${product.barcode}" onclick="add_to_ordercard(this, '${product.barcode}')">Add</button>
              </td>
    
  
            </tr>`

        });
        $("#product_row").html(data);
      }
    })
    .catch(error => {
      console.error('Error getting list of product:', error.message);
    });
}



//TODO: tách ra từng js cho partials vì render chỉ read property , 
// các element của partials hiện tại
profile.addEventListener('click', function () {
  console.log('profile page');
  window.location.href = "/profile"
});





// Lắng nghe sự kiện click của nút "Có"
log_out.addEventListener('click', function () {
  // Gửi yêu cầu đăng xuất đến máy chủ
  fetch('/logout', {
    method: 'POST', // Hoặc GET, tùy thuộc vào cách bạn triển khai
    credentials: 'same-origin' // Đảm bảo gửi cookie và thông tin xác thực cùng phiên
  })
    .then(function (response) {
      // Xử lý phản hồi từ máy chủ
      console.log(response.data);
      if (response.ok) {
        return response.json();
      }

    })
    .then(function (data) {
      // Xử lý dữ liệu nhận được từ phản hồi
      if (data.flashMessage.type === 'success') {
        window.location.reload();
      }
      else {
        window.location.href = '/login'
      }

    })
    .catch(function (error) {
      // Xử lý lỗi khi gửi yêu cầu
      console.log('Lỗi khi gửi yêu cầu đăng xuất:', error);
      window.location.href = '/login'
    });
});



mode.addEventListener("click", () => {
  body.classList.toggle('dark');
  if (body.classList.contains('dark')) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "");
  }
})


let getmode = localStorage.getItem('mode');
if (getmode && getmode === "dark") {
  body.classList.toggle('dark');
}


if (offcanvasElement) {
  const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
}


closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  homeSection.classList.toggle('sidebar-open');
  if (offcanvasElement) {
    bsOffcanvas.hide();
  }
  // offcanvasElement.classList.remove('show');
  // homeSection.classList.remove('offcanvas-open');
  // if (menuIcon) {
  //   if (homeSection.classList.contains('offcanvas-open'))
  //   homeSection.classList.toggle('sidebar-open');
  // }

  // if (sidebar.classList.contains('open')) {
  //   localStorage.setItem("status", "open");
  // } else {
  //   localStorage.setItem("status", "");
  // }
  menuBtnChange();//calling the function(optional)
});



if (offcanvasElement) {
  offcanvasElement.addEventListener('show.bs.offcanvas', event => {
    homeSection.classList.add('offcanvas-open');
    sidebar.classList.remove("open");
    homeSection.classList.remove('sidebar-open');
  });

  offcanvasElement.addEventListener('hide.bs.offcanvas', event => {
    homeSection.classList.remove('offcanvas-open');
  });
}



// let getstatus = localStorage.getItem('status');
// if (getstatus && getstatus === "open") {
//   sidebar.classList.toggle("open");
//   homeSection.classList.toggle('sidebar-open');
// }


function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");//replacing the iocns class
  }
}





//Admin page redirect
const student_manager = document.querySelector(".Student"),
  instructor_manager = document.querySelector(".Instructor"),
  course_manager = document.querySelector(".CourseManager"),
  transaction = document.querySelector(".Transaction"),
  statistical = document.querySelector(".Statistical");


if (body) {
  if (student_manager) {
    student_manager.addEventListener('click', function () {
      console.log('student manager page');
      window.location.href = "/admin/student"
    });
  }
  if (instructor_manager) {
    instructor_manager.addEventListener('click', function () {
      console.log('instructor manager page');
      window.location.href = "/admin/instructor"
    });
  }
  if (course_manager) {
    course_manager.addEventListener('click', function () {
      console.log('course manager page');
      window.location.href = "/admin/course"
    });
  }
  if (transaction) {
    transaction.addEventListener('click', function () {
      console.log('transaction page');
      window.location.href = "/admin/transaction"
    });
  }
  if (statistical) {
    statistical.addEventListener('click', function () {
      console.log('statistical page');
      window.location.href = "/admin/statistical"
    });
  }


}





// TODO important
//Student and Instructor page redirect
const course_page = document.querySelector(".Course"),
  subscribed_page = document.querySelector(".Subscribed"),
  exercise_page = document.querySelector(".Exercise");


if (body) {
  if (course_page) {
    course_page.addEventListener('click', function () {
      console.log('course page');
      window.location.href = "/home/course"

    });
  }


  if (subscribed_page) {
    subscribed_page.addEventListener('click', function () {
      console.log('Subscribed page');
      window.location.href = "/home/subscribed"
    });
  }

  if (exercise_page) {
    exercise_page.addEventListener('click', function () {
      console.log('Exercise page');
      window.location.href = "/home/exercise"
    });
  }










}


const editButton = document.getElementById('editRequest');
function toggleEdit(id) {
  const inputs = document.querySelectorAll('input');
  if (editButton.classList.contains('active')) {
    // Gửi biểu mẫu

    const productName = document.getElementById('productname').value;
    const importPrice = document.getElementById('importprice').value;
    const retailPrice = document.getElementById('retailprice').value;
    const inventory = document.getElementById('inventory').value;
    const category = document.querySelector('input[name="category"]:checked');
    const category_value = category ? category.value : "";
    const fileInput = document.getElementById('customFile');


    // Create the data object
    const data = {
      productname: productName,
      importprice: importPrice,
      retailprice: retailPrice,
      inventory: inventory,
      category: category_value,
    };
    console.log(data);
    // Send the data using fetch
    fetch('/admin/product/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.update) {
          const product = data.product
          console.log(data.product); // true
          window.location.reload();
        }
        else {
          showflashmessage(data.status, data.message)

        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    console.log(id);
    // window.location.reload()
  }
  inputs.forEach(function (input) {
    input.classList.toggle('editing');
    input.disabled = !input.disabled;
  });
  editButton.classList.toggle('active');
  editButton.textContent = (editButton.classList.contains('active')) ? 'Save' : 'Edit';
}





function uploadFiles(event, endpoint) {
  event.preventDefault();
  const progressBarFill = document.querySelector('.progress-bar');
  const progressBar = document.querySelector('.progress');
  const uploadButton = document.getElementById('upload');
  const fileInput = document.getElementById('customFile');

  const files = fileInput.files;
  const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
  const maxSize = 20 * 1024 * 1024; // Kích thước tối đa: 20 MB

  let uploadedSize = 0;
  let fileCount = files.length;
  let flag = false;

  Array.from(files).forEach((file) => {
    if (file.size <= maxSize) {
      progressBar.style.display = 'block';
      progressBarFill.style.width = '0%';
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append('file', file);
      formData.append('action', 'changed_avatar');

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          uploadedSize += event.loaded;
          if (uploadButton) {
            uploadButton.disabled = true;
          }

          const percent = Math.round((uploadedSize / totalSize) * 100);
          updateProgress(percent);
          if (percent >= 100) {
            setTimeout(() => {
              progressBar.style.display = 'none';
              flag = true;
            }, 2000);
          }
        }
      });
      //TÙY CHỈNH UPLOAD VÀ RELOAD
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setTimeout(() => {
              if (response.uploaded && flag) {
                // console.log("uploaded")

                if (uploadButton) {
                  uploadButton.disabled = false;
                  window.location.reload();
                }



              }
            }, 2100);

          }
        }
      };
      console.log("upload :" + file.name)
      xhr.open('POST', endpoint);
      xhr.send(formData);
    } else {
      showflashmessage('warning', `File ${file.name} exceeds the size limit.`);
    }
  });
}

function changeFullname(event) {
  event.preventDefault();
  const fullnameInput = document.querySelector('input[name="fullname"]');
  const fullnameValue = fullnameInput ? fullnameInput.value : "";

  fetch("/change_name", {
    method: "POST",
    headers: {
      "Content-Type": "application/json" // Đặt kiểu dữ liệu là JSON
    },
    body: JSON.stringify({ fullname: fullnameValue }) // Chuyển đổi dữ liệu thành chuỗi JSON
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        window.location.reload();
      }
      else { showflashmessage(data.status, data.message); }


    })
    .catch(function (error) {
      // Xử lý lỗi (nếu có)
      console.error("Error:", error);
    });


}





function changePassword(event) {
  event.preventDefault();
  // Lấy giá trị từ các trường nhập liệu
  var currpass = document.querySelector('input[name="currpass"]').value;
  var newpass = document.querySelector('input[name="newpass"]').value;
  var renewpass = document.querySelector('input[name="renewpass"]').value;

  // Tạo đối tượng dữ liệu để gửi lên máy chủ
  var data = {
    currpass: currpass,
    newpass: newpass,
    renewpass: renewpass
  };
  console.log(data);

  fetch("/change_pass", {
    method: "POST",
    headers: {
      "Content-Type": "application/json" // Đặt kiểu dữ liệu là JSON
    },
    body: JSON.stringify(data) // Chuyển đổi dữ liệu thành chuỗi JSON
  })
    .then(response => response.json())
    .then(data => {
      // showflashmessage(data.status, data.message)
      if (data.status === "success") {
        window.location.reload();

      }
      else { showflashmessage(data.status, data.message); }
    })
    .catch(function (error) {
      // Xử lý lỗi (nếu có)
      console.error("Error:", error);
    });

}




function getprofilebyId(id) {
  window.location.href = "/profile/" + id;
}

function gotocart() {
  window.location.href = "/home/cart";
}


function getcoursebyId(id) {
  console.log(id)
  window.location.href = "/home/course/" + id;
}

function getlecturebyId(id) {
  console.log(id)
  window.location.href = "/home/lecture/" + id;
}

  function addtocart(id) {
    console.log(id)

    fetch("/home/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // Đặt kiểu dữ liệu là JSON
      },
      body: JSON.stringify({courseId : id}) // Chuyển đổi dữ liệu thành chuỗi JSON
    })
      .then(response => response.json())
      .then(data => {
        // showflashmessage(data.status, data.message)
        if (data.status === "success") {
          // window.location.reload();
          showflashmessage(data.status, data.message);
        }
        else { showflashmessage(data.status, data.message); }
      })
      .catch(function (error) {
        // Xử lý lỗi (nếu có)
        console.error("Error:", error);
      });

  }
  
  function delcart(id) {
    console.log(id)

    fetch("/home/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // Đặt kiểu dữ liệu là JSON
      },
      body: JSON.stringify({del_courseId : id}) // Chuyển đổi dữ liệu thành chuỗi JSON
    })
      .then(response => response.json())
      .then(data => {
        // showflashmessage(data.status, data.message)
        if (data.status === "success") {
          window.location.reload();
          showflashmessage(data.status, data.message);
        }
        else { showflashmessage(data.status, data.message); }
      })
      .catch(function (error) {
        // Xử lý lỗi (nếu có)
        console.error("Error:", error);
      });

  }
  
function callback(url) {
  window.location.href = url;
}

function viewhistorypurchase(id) {
  console.log(id)
  window.location.href = "/admin/customer/" + id;
}

function gotodetailsorder(id) {
  console.log(id)
  window.location.href = "/admin/order/" + id;
}

var global_id = "";
const delete_modal = document.querySelector("#deleteModal");

const delete_btn = document.querySelector("#confirm_delete")

if (delete_btn) {
  delete_btn.addEventListener("click", () => { deleteproductbyId(global_id) })

}


function deleteproduct(id) {
  $("#deleteModal").modal('show');
  global_id = id;
}

function deleteproductbyId(id) {
  console.log(id)


  fetch('/admin/product/' + id, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      if (data.delete) {
        const product = data.product
        console.log(data.product); // true
        window.location.href = data.redirect;
      }
      else {
        showflashmessage(data.status, data.message)
      }

    })
    .catch(error => {
      console.error('Error:', error);
    });

}

function resendVerifyEmail(email, accountid) {
  console.log(email)
  fetch("/resend_email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json" // Đặt kiểu dữ liệu là JSON
    },
    body: JSON.stringify({ email: email, accountId: accountid }) // Chuyển đổi dữ liệu thành chuỗi JSON
  })
    .then(response => response.json())
    .then(data => {
      // showflashmessage(data.status, data.message)
      if (data.status === "success") {
        showflashmessage(data.status, data.message);

      }

    })
    .catch(function (error) {
      // Xử lý lỗi (nếu có)
      console.error("Error:", error);
    });
}

function lock_unlock_Account(accountid) {
  console.log(accountid)
  fetch("/lock_account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json" // Đặt kiểu dữ liệu là JSON
    },
    body: JSON.stringify({ accountID: accountid }) // Chuyển đổi dữ liệu thành chuỗi JSON
  })
    .then(response => response.json())
    .then(data => {
      // showflashmessage(data.status, data.message)
      if (data.status === "success") {
        window.location.reload();
      }

    })
    .catch(function (error) {
      // Xử lý lỗi (nếu có)
      console.error("Error:", error);
    });
}


function updateProgress(percent) {
  const progressBarFill = document.querySelector('.progress-bar');
  progressBarFill.style.width = `${percent}%`;

  if (percent >= 100) {
    progressBarFill.innerText = 'Uploaded!';
  } else {
    progressBarFill.innerText = `${percent}%`;
  }
}


function showflashmessage(type, message) {

  toastr[type](message)

  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
}

function closeModal(id) {
  $(`#${id}`).modal('hide');
}

function resetModal(id) {
  const form = document.getElementById(id);
  if (form) {
    form.reset();
  }
}


/**
 * Scroll top button
 */
// Tệp main.js - External JavaScript

document.addEventListener('DOMContentLoaded', function () {
  let scrollableDiv = document.querySelector('.home-section');
  let scrollTopButton = document.querySelector('.scroll-top');

  // Lắng nghe sự kiện scroll của khối div
  scrollableDiv.addEventListener('scroll', function () {
    toggleScrollTopButton();
  });

  // Lắng nghe sự kiện click của nút "scroll top"
  scrollTopButton.addEventListener('click', function () {
    scrollToTop();
  });

  // Kiểm tra và cập nhật trạng thái của nút "scroll top"
  function toggleScrollTopButton() {
    let scrollTop = scrollableDiv.scrollTop;
    let scrollHeight = scrollableDiv.scrollHeight;
    let clientHeight = scrollableDiv.clientHeight;

    if (scrollTop > 0) {
      scrollTopButton.classList.add('active');
    } else {
      scrollTopButton.classList.remove('active');
    }

    if (scrollTop + clientHeight >= scrollHeight) {
      // Đã cuộn đến cuối khối div
      // Có thể thực hiện các hành động khác tại đây (nếu cần)
    }
  }

  // Cuộn khối div đến đầu trang
  function scrollToTop() {
    homeSection.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
});


let lecture_page = document.querySelector('.lecture_page');

if (lecture_page) {
  $('.toggle_show_lecture').click(function () {
    $(this).toggleClass('fa-angle-down fa-angle-up');
    $(this).parent().next('#all_lecture').toggleClass('open');
  });

  function change_lecture(lectureTitle, lectureLink, lectureDescription) {
    console.log(lectureTitle)
    console.log(lectureLink)
    console.log(lectureDescription)
    
    $('#lecture_link').attr('src', lectureLink);
    // Thay đổi nội dung của lecture title
    $('.lecture_title').text(lectureTitle);

    // Thay đổi nội dung của lecture description
    $('.lecture_description').text(lectureDescription);
  }
}


