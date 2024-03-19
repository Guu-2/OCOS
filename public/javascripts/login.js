const 
    form = document.querySelector('.login_form'),
    formOpenbtn = document.querySelector('#form_open'),
    home = document.querySelector('.home'),
    formcontainer = document.querySelector('.form_container'),
    formclosebtn = document.querySelector('.close_form'),
    loginbtn = document.querySelector('#login'),
    password_hidden = document.querySelectorAll('.password_hidden')

formOpenbtn.addEventListener("click", () => home.classList.add("show"))
formclosebtn.addEventListener("click", () => home.classList.remove("show"))

password_hidden.forEach((icon) => {
    icon.addEventListener("click", () => {
        let input_pass = icon.parentElement.querySelector('input');
        if (input_pass.type === "password") {
            input_pass.type = "text";
            icon.classList.replace("uil-eye-slash", "uil-eye");
        }
        else {
            input_pass.type = "password";
            icon.classList.replace("uil-eye", "uil-eye-slash");
        }
    })
});


form.addEventListener("submit", (event) => {
    // showflashmessage("success" , "thêm thành công")
    event.preventDefault(); // Ngăn chặn việc gửi form đi
    console.log("here");
    // Lấy giá trị từ các trường nhập liệu
    const usname = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const data = {
        username: usname,
        password: pass,
    };
    console.log(data);

    // Sử dụng fetch để gửi dữ liệu đến endpoint (giả sử là POST request)
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Đặt kiểu dữ liệu là JSON
        },
        body: JSON.stringify(data) // Chuyển đổi dữ liệu thành chuỗi JSON
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.status === "success"){
                window.location.href = data.redirect;
            }else{
                showflashmessage(data.status , data.message);
            }

        })
        .catch(function (error) {
            // Xử lý lỗi (nếu có)
            console.error("Error:", error);
        });

})


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
  