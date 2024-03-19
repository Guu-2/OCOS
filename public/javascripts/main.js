const sidebar = document.querySelector(".sidebar"),

  show_card = document.querySelector(".show_card"),

  closeBtn = document.querySelector("#btn_sidebar"),


  homeSection = document.querySelector('.home-section'),

  body = document.querySelector('body'),

  mode = document.querySelector('.toggle_switch'),

  mode_text = document.querySelector('.mode_name'),

  log_out = document.querySelector('#confirm'),

  profile = document.querySelector(".profile-details"),

  close_order_card = document.querySelectorAll(".btn_order"),

  open_order_card = document.querySelector(".NewOrder"),

  order = document.querySelector(".order_card"),

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

// if(open_order_card){
//   open_order_card.addEventListener("click" , ()=> {
//     // Xử lý sự kiện click tại đây
//     console.log("clicked");
//     order.classList.toggle("open");
//     homeSection.classList.toggle('order-open');

//     sidebar.classList.remove("open");
//     homeSection.classList.remove('sidebar-open');


//     if (!order.classList.contains("open")) {
//       show_card.classList.replace("fa-circle-minus", "fa-circle-plus")
//     } else {
//       show_card.classList.replace("fa-circle-plus", "fa-circle-minus")
//     }
//   })


// }

if (close_order_card) {
  close_order_card.forEach(button => {
    button.addEventListener('click', function () {
      // Xử lý sự kiện click tại đây
      console.log("clicked");
      order.classList.toggle("open");
      homeSection.classList.toggle('order-open');

      sidebar.classList.remove("open");
      homeSection.classList.remove('sidebar-open');


      if (!order.classList.contains("open")) {
        show_card.classList.replace("fa-circle-minus", "fa-circle-plus")
      } else {
        show_card.classList.replace("fa-circle-plus", "fa-circle-minus")
      }

    });
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


closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  homeSection.classList.toggle('sidebar-open');

  if (order) {
    order.classList.remove("open");
    homeSection.classList.remove('order-open');
  }

  // if (sidebar.classList.contains('open')) {
  //   localStorage.setItem("status", "open");
  // } else {
  //   localStorage.setItem("status", "");
  // }
  menuBtnChange();//calling the function(optional)
});

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
const staff_manager = document.querySelector(".StaffManager"),
  product_manager = document.querySelector(".ProductManager"),
  customer_manager = document.querySelector(".CustomerManager"),
  transaction = document.querySelector(".Transaction"),
  statistical = document.querySelector(".Statistical"),
  admin_body = document.querySelector('.admin');

if (admin_body) {
  if (staff_manager) {
    staff_manager.addEventListener('click', function () {
      console.log('staff manager page');
      window.location.href = "/admin/staff"
    });
  }
  if (product_manager) {
    product_manager.addEventListener('click', function () {
      console.log('product manager page');
      window.location.href = "/admin/product"
    });
  }
  if (customer_manager) {
    customer_manager.addEventListener('click', function () {
      console.log('customer manager page');
      window.location.href = "/admin/customer"
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

  //Admin addstaff
  const add_staff_form = document.querySelector("#addstaffForm"),
    list_staff = document.querySelector("#list_staff"),
    empty_staff = document.querySelector("#list_staff_empty"),
    roleBlock = document.querySelector("#roleBlock"),
    radioButtons = document.querySelectorAll('input[name="role"]');

  // phần tử hướng sự kiện khác null
  if (radioButtons) {
    radioButtons.forEach(function (radioButton) {
      radioButton.addEventListener('change', function () {
        if (this.value === "manager") {
          // Hiển thị khối HTML bổ sung
          console.log("is admin account")
          roleBlock.style.display = "block";
        } else {
          // Nếu radio button được bỏ chọn, ẩn khối HTML bổ sung
          roleBlock.style.display = "none";
        }
      });
    });
  }

  if (add_staff_form) {
    // Lắng nghe sự kiện submit của form
    add_staff_form.addEventListener('submit', add_staff);

  }
  function add_staff(event) {
    // showflashmessage("success" , "thêm thành công")
    event.preventDefault(); // Ngăn chặn việc gửi form đi
    console.log("here");
    // Lấy giá trị từ các trường nhập liệu
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const role_element = document.querySelector('input[name="role"]:checked');
    const role = role_element ? role_element.value : '';
    console.log(role)
    const data = {
      fullname: fullname,
      email: email,
      role: role
    };

    // if (role === "manager") {
    //   // Lấy giá trị từ các checkbox
    const access = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    // if (access.length === 0) {
    //   showflashmessage("warning", "Vui lòng chọn các quyền hạn của tài khoản")
    //   return;
    // }
    data.access = access;
    // }

    console.log(data);

    // Sử dụng fetch để gửi dữ liệu đến endpoint (giả sử là POST request)
    fetch("/admin/staff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // Đặt kiểu dữ liệu là JSON
      },
      body: JSON.stringify(data) // Chuyển đổi dữ liệu thành chuỗi JSON
    })
      .then(response => response.json())
      .then(data => {
        // Xử lý phản hồi từ server
        if (data.added) {
          // add_staff_form.reset();
          resetModal("addstaffForm");
          roleBlock.style.display = "none";
          empty_staff.style.display = "none";
          // Đóng modal khi thành công
          closeModal('addstaffModal')
          // $('addstaffModal').modal('hide');
          // Xử lý dữ liệu nhận được từ máy chủ
          const account = data.account
          console.log(data.account); // true
          // console.log(data.status); // "warning"
          // console.log(data.message); // "Account already exists"

          // console.log(response.message);
          const list_item = `
            <li class="list-group-item d-flex justify-content-between align-items-center"
            onclick="getprofilebyId('${account._id.toString()}')">
              <div class="account_avatar">
                  <img src="${account.profilePicture}" alt="err">
              </div>
              <div class="account_name">
                  ${account.fullName} <strong>( ${account.role})</strong>
              </div>
              <div class="account_status">
                  <span class="badge bg-primary rounded-pill"> ${account.status}</span>
              </div>

              <div class="history_login">
                  <span class="badge bg-primary rounded-pill">${account.lastLogin}</span>
              </div>


          </li>
          `
          list_staff.innerHTML += list_item;
        }
        showflashmessage(data.status, data.message)

        // Thực hiện các hành động tiếp theo...
      })
      .catch(function (error) {
        // Xử lý lỗi (nếu có)
        console.error("Error:", error);
      });

    // TODO: reset form khi tắt modal

    // Lấy modal bằng id
  };


  //Admin add_product
  const add_product_form = document.querySelector("#addproductForm");


  if (add_product_form) {
    // Lắng nghe sự kiện submit của form
    // const form = document.getElementById('addproductForm');
    // confirm_add.addEventListener('click', uploadFiles);
    add_product_form.addEventListener('submit', add_product);


  }

  function add_product(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the input values

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
    const selectedFile = fileInput.files[0]; // Lấy tệp được chọn (nếu có)
    console.log(selectedFile);
    if (productName && importPrice && category_value && retailPrice && inventory) {
      if (selectedFile) {
        uploadFiles(event, "/upload/product")
      }
      else {
        showflashmessage("warning", "Không có tệp nào được chọn.")
      }
    }

    // Send the data using fetch
    fetch('/admin/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.added) {
          // add_staff_form.reset();
          resetModal("addproductForm");
          closeModal('addproductModal')
          // Xử lý dữ liệu nhận được từ máy chủ
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

  }
}





//Staff page redirect
const new_order = document.querySelector(".NewOrder"),
  staff_statistical = document.querySelector(".Statistical"),
  staff_body = document.querySelector(".staff");


if (staff_body) {
  if (new_order) {
    new_order.addEventListener('click', function () {
      console.log('staff order page');
      window.location.href = "/home/order"

    });
  }


  if (staff_statistical) {
    staff_statistical.addEventListener('click', function () {
      console.log('staff order page');
      window.location.href = "/home/statistical"
    });
  }



  // const create_order = document.getElementById('seach_icon');
  const productName = document.getElementById('order_name');
  const customer_name = document.getElementById("customer_name")
  const customer_address = document.getElementById("customer_address")
  const icon_edit = document.getElementById("pencil_icon");
  function toggle_create_order() {
    if (productName.value != "" && productName.disabled == false) {
      // Toggle class "edit"
      // icon_edit.classList.toggle("edit");
      // req_customer_toggle()
      console.log(productName.value);
      fetch('/home/check_customer/' + productName.value, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.find) {

            customer_name.value = data.customer.fullName
            customer_address.value = data.customer.address

            // Mở khóa trường customer_name
            customer_name.disabled = true;
            // Mở khóa trường customer_address
            customer_address.disabled = true;
          }
          else {

            customer_name.value = ""
            customer_address.value = ""
            // Mở khóa trường customer_name
            customer_name.disabled = false;
            // Mở khóa trường customer_address
            customer_address.disabled = false;
            // customer_name.value = "A"

          }
          showflashmessage(data.status, data.message)



        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
    productName.classList.toggle('editing');
    productName.disabled = !productName.disabled;
    icon_edit.classList.toggle("edit");
    req_customer_toggle()

  }


  function req_customer_toggle() {
    // Thay đổi biểu tượng
    if (icon_edit.classList.contains("edit")) {

      icon_edit.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
    } else {

      icon_edit.innerHTML = '<i class="fa-solid fa-pen"></i>';
    }
  }



  const createOrderButton = document.querySelector('.createOrder button');
  const amountPaidInput = document.getElementById('amount-paid');
  if (createOrderButton) {
    createOrderButton.addEventListener('click', function () {

      if (productName.value == "" || customer_name.value == "" || customer_address.value == "") {
        showflashmessage("warning", "Please provide customer infomation")
      } else {
        const orderItems = [];
        var cus_phone = productName.value;
        var cus_fullname = customer_name.value;
        var cus_address = customer_address.value;
        // Lấy dữ liệu từ order_content
        const orderContent = document.querySelectorAll('.addOrder .list-group-item');
        if (orderContent.length === 0) {
          showflashmessage("warning", "Please add product to the order");
        }
        else {
          orderContent.forEach(product => {

            // const productName = product.textContent.trim();
            const productId = product.getAttribute('data-product-id'); // Lấy productId từ thuộc tính data-product-id
            const quantityInput = product.querySelector('input[type="number"]');
            const quantity = parseFloat(quantityInput.value);
            const priceElement = product.querySelector('.price');
            const productName = (product.querySelector('.productName')).textContent;
            const price = parseFloat(priceElement.textContent);
            orderItems.push({ productId, productName, quantity, price });
          });


          const customerInfo = { phone: cus_phone, fullname: cus_fullname, address: cus_address };
          // Lấy dữ liệu từ total, paid và tính toán change
          // const product_name = 
          const totalPriceElement = document.querySelector('.total .tol');
          const totalPrice = parseFloat(totalPriceElement.textContent.replace(/[^0-9.-]+/g, ""));
          if (amountPaidInput) {
            const amountPaid = parseFloat(amountPaidInput.value);
            
            if (!amountPaid) {
              showflashmessage("warning", "Amount Paid is Require");
            }
            else {
              const change = amountPaid - totalPrice;
              if(!change || change < 0){
                showflashmessage("warning", "Amount Invalid")
              }
              else{
                // Gửi dữ liệu lên server để lưu vào MongoDB hoặc thực hiện các hành động cần thiết khác
              const data = { customerInfo, orderItems, totalPrice, amountPaid, change};
              console.log('Data to be sent to the server:', data);
      
              // Viết mã để gửi data lên server ở đây
              // Ví dụ: sử dụng fetch hoặc AJAX để gửi dữ liệu
              fetch('/home/order', { // Sử dụng đường dẫn đầy đủ '/home/order'
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                })
                .then(result => {
                  console.log('Server response:', result);
                  getbill(data)
      
                })
                .catch(error => {
                  console.error('There was a problem with the fetch operation:', error);
                });
              }

              
            }
          }


        }


      }

    });

  }


  function getbill(data) {
    console.log(data)
    fetch('/home/bill', { // Sử dụng đường dẫn đầy đủ '/home/order'
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        tmp = "";
        console.log('Server response:', result);
        result.product.forEach(element => {
          tmp +=
            `<tr>
              <td>${element.productName}</td>
              <td>${element.quantity}</td>
              <td>${element.price}</td>
          </tr>`

        });

        document.body.innerHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
        </head>
        <body>
            <div class="container mt-5">
                <div class="d-flex justify-content-center row">
                    <div class="col-md-8">
                        <div class="p-3 bg-white rounded">
                            <div class="row">
                                <div class="col-md-6">
                                    <h1 class="text-uppercase">Invoice</h1>
                                    <div class="billed"><span class="font-weight-bold text-uppercase">Billed:</span><span class="ml-1">${result.fullname}</span></div>
                                    <div class="billed"><span class="font-weight-bold text-uppercase">Date:</span><span class="ml-1">${result.date}</span></div>
                                </div>
  
                            </div>
                            <div class="mt-3">
                                <div class="table-responsive">
                                    <table class="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>`
          + tmp +
          `
                                            <tr>
                                                <td></td>
                                                <td>Total</td>
                                                <td>${result.totalPrice}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Total</th>
                                                <th>Amount</th>
                                                <th>Change</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                          <tr>
                                              <td>${result.totalPrice}</td>
                                              <td>${result.amountPaid}</td>
                                              <td>${result.change}</td>
                                          </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="text-right mb-3"><button class="btn btn-danger btn-sm mr-5" type="button"><a href="/home/" style="text-decoration: none; font-weight: bold;color:white;">BACK</a></button></div>
                        </div>
                    </div>
                </div>
            </div>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        </body>
        </html>
        `;
      })

      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  const intial_form = document.querySelector(".intial_form");
  if (intial_form) {
    // Lắng nghe sự kiện submit của form
    intial_form.addEventListener('submit', change_default_password);
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


function changeDefaultPassword(event) {
  event.preventDefault();
  // Lấy giá trị từ các trường nhập liệu
  var newpass = document.querySelector('input[name="newpass"]').value;
  var renewpass = document.querySelector('input[name="renewpass"]').value;

  // Tạo đối tượng dữ liệu để gửi lên máy chủ
  var data = {
    newpass: newpass,
    renewpass: renewpass
  };
  console.log(data);

  fetch("/home/intial", {
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
        window.location.href = data.redirect;
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

function getproductbyId(id) {
  console.log(id)
  window.location.href = "/admin/product/" + id;
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