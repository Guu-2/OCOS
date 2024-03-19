
const sidebar = document.querySelector(".sidebar");

const closeBtn = document.querySelector("#btn_sidebar");





const show_card = document.querySelector(".show_card");

const searchBtn = document.querySelector(".bx-search");

const homeSection = document.querySelector('.home-section');

const body = document.querySelector('body');

const mode = document.querySelector('.toggle_switch');

const mode_text = document.querySelector('.mode_name');

const log_out = document.querySelector('#confirm')

const profile = document.querySelector(".profile-details");

profile.addEventListener('click', function() {
  // window.location.href = "/home/profile";
  fetch('/home/profile', {
    method: 'GET', // Hoặc GET, tùy thuộc vào cách bạn triển khai
    credentials: 'same-origin' // Đảm bảo gửi cookie và thông tin xác thực cùng phiên
  })
    .then(function (response) {
      // Xử lý phản hồi từ máy chủ
      console.log(response.data);
      if (response.ok) {
        return response.json();
      } else {
        // Xử lý lỗi khi đăng xuất không thành công
        console.log('Lỗi khi đăng xuất');
      }
    })
    .then(function (data) {
      // Xử lý dữ liệu nhận được từ phản hồi
      if (data.flashMessage.type === 'success') {
        window.location.reload();
      }
    })
    .catch(function (error) {
      // Xử lý lỗi khi gửi yêu cầu
      console.log('Lỗi khi gửi yêu cầu đăng xuất:', error);
    });
});


// Lắng nghe sự kiện click của nút "Có"

log_out.addEventListener('click', function() {
  // Gửi yêu cầu đăng xuất đến máy chủ
  fetch('/logout', {
    method: 'POST', // Hoặc GET, tùy thuộc vào cách bạn triển khai
    credentials: 'same-origin' // Đảm bảo gửi cookie và thông tin xác thực cùng phiên
  })
  .then(function(response) {
    // Xử lý phản hồi từ máy chủ
    console.log(response.data);
    if (response.ok) {
      return response.json();
    } else {
      // Xử lý lỗi khi đăng xuất không thành công
      console.log('Lỗi khi đăng xuất');
    }
  })
  .then(function(data) {
    // Xử lý dữ liệu nhận được từ phản hồi
    if(data.flashMessage.type === 'success'){
      window.location.reload();
    }
  })
  .catch(function(error) {
    // Xử lý lỗi khi gửi yêu cầu
    console.log('Lỗi khi gửi yêu cầu đăng xuất:', error);
  });
});


mode.addEventListener("click" , ()=> {
  body.classList.toggle('dark');
})



closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  homeSection.classList.toggle('sidebar-open');



  menuBtnChange();//calling the function(optional)
});






// searchBtn.addEventListener("click", () => { // Sidebar open when you click on the search iocn
//   sidebar.classList.toggle("open");
//   updateHomeSectionWidth();
//   menuBtnChange(); //calling the function(optional)
// });

// following are the code to change sidebar button(optional)
function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");//replacing the iocns class
  }
}


