// <I> ---------------------DASHBOARD--------------------------
function showDashboard() {
    document.getElementById("dashboard-content").style.display = "block";
    document.getElementById("profile-content").style.display = "none";
    document.getElementById("history-content").style.display = "none";
    document.getElementById("action-content").style.display = "none";

}

//Bật tắt đèn, quạt
let fanStatus = false; // Ban đầu quạt đang tắt
let lightStatus = false; // Ban đầu đèn đang tối

function toggleLight() {
    lightStatus = !lightStatus; // Đảo ngược trạng thái đèn
    const lightIcon = document.getElementById("light-icon");
    const lightButton = document.getElementById("light-button");

    // Tạo đối tượng JSON chứa trạng thái đèn
    const data = { action: lightStatus ? 'on' : 'off' };

    fetch('http://172.20.10.2:5000/api/light-control', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Chuyển đối tượng JSON thành chuỗi
    })
        .then(response => response.json())
        .then(result => {
            // Xử lý kết quả từ máy chủ
            console.log(result);
        })
        .catch(error => {
            console.error('Error sending light control request:', error);
        });

    if (lightStatus) {
        lightIcon.src = "/assets/temp/light-bulb.png";
        lightButton.textContent = "OFF";
        lightButton.classList.add("on");
    } else {
        lightIcon.src = "/assets/temp/light-bulb-off.png";
        lightButton.textContent = "ON";
        lightButton.classList.remove("on");
    }
}

// Tạo kết nối tới máy chủ WebSocket của backend
const socket = io.connect('http://172.20.10.2:5000/test'); // Địa chỉ máy chủ của bạn có thể khác

// Lắng nghe sự kiện 'connect' từ máy chủ
socket.on('connect', () => {
    console.log('Connected to backend WebSocket');
});

// Lắng nghe sự kiện 'message_from_backend' từ máy chủ
socket.on('message_from_backend', (data) => {
    // Xử lý thông điệp từ máy chủ ở đây
    console.log('Received message from backend:', data);
});



function toggleFan() {
    fanStatus = !fanStatus; // Đảo ngược trạng thái quạt <=> lightOn = false
    const fanIcon = document.getElementById("fan-icon");
    const fanButton = document.getElementById("fan-button");

    // Tạo đối tượng JSON chứa trạng thái đèn
    const data = { action: fanStatus ? 'on' : 'off' };

    fetch('http://172.20.10.2:5000/api/fan-control', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Chuyển đối tượng JSON thành chuỗi
    })
        .then(response => response.json())
        .then(result => {
            // Xử lý kết quả từ máy chủ
            console.log(result);
        })
        .catch(error => {
            console.error('Error sending fan control request:', error);
        });


    if (fanStatus) {
        fanIcon.src = "/assets/temp/fan_on.gif";
        fanButton.textContent = "OFF";
        fanButton.classList.add("on"); // Thêm luật "on" để có màu đỏ nền
    } else {
        fanIcon.src = "/assets/temp/fan.png"; // Hình ảnh quạt tắt
        fanButton.textContent = "ON";
        fanButton.classList.remove("on"); // Xóa lớp "on" để trở về nền xanh
    }
}

// Tạo kết nối tới máy chủ WebSocket của backend
const socket1 = io.connect('http://172.20.10.2:5000/test1'); // Địa chỉ máy chủ của bạn có thể khác

// Lắng nghe sự kiện 'connect1' từ máy chủ
socket1.on('connect1', () => {
    console.log('Connected to backend WebSocket');
});

// Lắng nghe sự kiện 'message_from_backend1' từ máy chủ
socket1.on('message_from_backend1', (data) => {
    // Xử lý thông điệp từ máy chủ ở đây
    console.log('Received message from backend:', data);
});

// -------------------------------------------------

// Khởi tạo biểu đồ
const sensorChart = new Chart(document.getElementById("sensor-chart"), {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Nhiệt độ (°C)",
                data: [],
                borderColor: "red",
                fill: true, // Thêm màu nền
                backgroundColor: "rgba(255, 0, 0, 0.2)", // Màu nền cho Nhiệt độ
                cubicInterpolationMode: "monotone",
                yAxisID: "temperature-y-axis", // Chỉ định trục Y cho Nhiệt độ
            },
            {
                label: "Độ ẩm (%)",
                data: [],
                borderColor: "blue",
                fill: true, // Thêm màu nền
                backgroundColor: "rgba(0, 0, 255, 0.2)", // Màu nền cho Độ ẩm
                cubicInterpolationMode: "monotone",
                yAxisID: "humidity-y-axis", // Chỉ định trục Y cho Độ ẩm
            },
            {
                label: "Ánh sáng (lux)",
                data: [],
                borderColor: "green",
                fill: true, // Thêm màu nền
                backgroundColor: "rgba(0, 255, 0, 0.2)", // Màu nền cho Ánh sáng
                cubicInterpolationMode: "monotone",
                yAxisID: "light-y-axis", // Chỉ định trục Y cho Ánh sáng
            },
        ],
    },
    options: {
        responsive: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Thời gian",
                },
            },
            "temperature-y-axis": { // Trục Y cho Nhiệt độ
                position: "left", // Vị trí ở bên trái
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Nhiệt độ (°C)",
                },
            },
            "humidity-y-axis": { // Trục Y cho Độ ẩm
                position: "right", // Vị trí ở bên phải
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Độ ẩm (%)",
                },
            },
            "light-y-axis": { // Trục Y cho Ánh sáng
                position: "right", // Vị trí ở bên phải
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Ánh sáng (lux)",
                },
                grid: {
                    drawOnChartArea: false, // Không vẽ lưới trên biểu đồ
                },
            },
        },
    },
    plugins: {
        legend: {
            display: true,
        },
        tooltip: {
            mode: "index",
        },
        scroll: {
            enabled: true,
            max: 10,
        },
    },
});

// ----Nhận chuỗi JSON data_sensor trích rút thông tin nhiệt độ, độ ẩm, ánh sáng hiển thị lên FE.
// Tạo kết nối tới máy chủ WebSocket của backend
const socket2 = io.connect('http://172.20.10.2:5000/test2'); // Địa chỉ máy chủ của bạn có thể khác

// Lắng nghe sự kiện 'connect' từ máy chủ
socket2.on('connect2', () => {
    console.log('Connected to backend WebSocket');
});




let dustStatus = false; // Ban đầu độ bụi < 70
// Lắng nghe sự kiện 'message_from_backend2' từ máy chủ
socket2.on('message_from_backend2', (data) => {//Nhiệt độ độ ẩm ánh sáng
    // Xử lý thông điệp từ máy chủ ở đây
    console.log('Received message from backend:', data);

    // Hiển thị thông điệp trạng thái lên giao diện người dùng
    // Ví dụ: cập nhật một phần tử HTML để hiển thị trạng thái
    try {
        // Thử phân tích chuỗi JSON từ data.status
        const statusData = JSON.parse(data.status);

        // Truy xuất giá trị "status" từ statusData
        const now = new Date().toLocaleTimeString();
        const temperatureValue = statusData.temperature;
        const humidityValue = statusData.humidity;
        const lightValue = statusData.light;
        const dustValue = statusData.dust;

        document.getElementById("temperature").innerText = temperatureValue + "°C";
        document.getElementById("humidity").innerText = humidityValue + "%";
        document.getElementById("light").innerText = lightValue + " lux";
        // document.getElementById("dust").innerText = dustValue + "%";

        // Lấy các phần tử HTML cần thay đổi màu
        const temperatureItem = document.getElementById("temperature-item");
        const humidityItem = document.getElementById("humidity-item");
        const lightItem = document.getElementById("light-item");
        // const dustItem = document.getElementById("dust-item");

        // Cập nhật dữ liệu và nhãn trục x cho biểu đồ
        sensorChart.data.labels.push(now);

        // Thêm giá trị vào mảng dữ liệu của từng đường dữ liệu
        sensorChart.data.datasets[0].data.push(temperatureValue);
        sensorChart.data.datasets[1].data.push(humidityValue);
        sensorChart.data.datasets[2].data.push(lightValue);

        // Giới hạn số lượng giá trị để biểu đồ không quá dài
        if (sensorChart.data.labels.length > 30) {
            sensorChart.data.labels.shift();
            sensorChart.data.datasets[0].data.shift();
            sensorChart.data.datasets[1].data.shift();
            sensorChart.data.datasets[2].data.shift();
        }

        // Cập nhật biểu đồ
        sensorChart.update();

        // Cập nhật màu sắc nền dựa trên giá trị
        updateBackgroundColor(temperatureItem, temperatureValue);
        updateBackgroundColor(humidityItem, humidityValue);
        updateBackgroundColor(lightItem, lightValue);




        // Dust -------------------------
        if (dustSensorData.labels.length >= 15) {
            // Nếu đã đạt đến giới hạn 30 điểm, loại bỏ điểm đầu tiên
            dustSensorData.labels.shift();
            dustSensorData.datasets[0].data.shift();
        }

        document.getElementById("dust").innerText = dustValue + "%";
        const dustItem = document.getElementById('dust-item');
        const dustColor = getDustColor(dustValue);

        dustItem.style.backgroundColor = dustColor;

        if (dustValue >= 70 && !dustStatus) {
            dustStatus = !dustStatus; // Đảo ngược trạng thái độ bụi
            // Khi giá trị độ bụi > 70, thêm lớp "blinking-light" cho vùng "light"
            document.querySelector('.light').classList.add('blinking-light');
            toggleLight();
            toggleFan();
        }
        if (dustValue < 70 && dustStatus) {
            dustStatus = !dustStatus; // Đảo ngược trạng thái độ bụi
            // Khi giá trị độ bụi không vượt quá 70, loại bỏ lớp "blinking-light" khỏi vùng "light"
            document.querySelector('.light').classList.remove('blinking-light');
            toggleLight();
            toggleFan();
        }
        // Lấy thời gian hiện tại (có thể thay đổi thành thời gian thực từ cảm biến của bạn)
        const currentTime = new Date();

        // Định dạng thời gian để hiển thị trên trục x của biểu đồ
        const formattedTime = currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();

        // Thêm giá trị mới vào biểu đồ
        dustSensorData.labels.push(formattedTime);
        dustSensorData.datasets[0].data.push(dustValue);

        // Cập nhật biểu đồ
        dustSensorChart.update();

    } catch (error) {
        console.error('Error parsing JSON data:', error);
    }
});

function updateBackgroundColor(element, value) {
    let color;

    if (element.id === "temperature-item") {
        if (value < 13) {
            color = "linear-gradient(120deg, #0000FF 10%, #00008B 100%)"; // Màu xanh dương đậm
        } else if (value < 25) {
            color = "linear-gradient(120deg, #4169E1 10%, #6495ED 100%)"; // Màu xanh dương nhạt
        } else if (value < 30) {
            color = "linear-gradient(120deg, #FFA500 10%, #FFD700 100%)"; // Màu cam
        } else {
            color = "linear-gradient(120deg, #FF4500 10%, #FF0000 100%)";; // Màu đỏ
        }
    } else if (element.id === "humidity-item") {
        if (value < 25) {
            color = "linear-gradient(120deg, #FF8C00 10%, #FF4500 100%)"; // Màu cam đậm
        } else if (value < 50) {
            color = "linear-gradient(120deg, #0000FF 10%, #4169E1 100%)"; // Màu xanh dương
        } else if (value < 75) {
            color = "linear-gradient(120deg, #008000 10%, #32CD32 100%)"; // Màu xanh lá cây
        } else {
            color = "linear-gradient(120deg, #006400 10%, #008000 100%)"; // Màu xanh lá cây đậm
        }
    } else if (element.id === "light-item") {
        if (value < 350) {
            color = "linear-gradient(120deg, rgb(123 117 118) 10%, rgb(74 66 70) 100%)"; // Màu hồng 
        } else if (value < 500) {
            color = "linear-gradient(120deg, rgb(255, 165, 0) 10%, rgb(255, 215, 0) 100%)"; // Màu tím
        } else if (value < 1000) {
            color = "linear-gradient(120deg, rgb(237 196 120) 10%, rgb(255, 215, 0) 100%)"; // Màu vàng đậm
        } else {
            color = "linear-gradient(120deg, rgb(246 241 233) 10%, rgb(255, 215, 0) 100%)"; // Màu đỏ đậm
        }
    }

    element.style.background = color;
}


const dustSensorData = {
    labels: [],
    datasets: [
        {
            label: "Cảm biến độ bụi",
            data: [],
            borderColor: "orange",
            fill: true, // Thêm màu nền
            backgroundColor: "rgba(255, 165, 0, 0.2)", // Màu nền cho Độ bụi
            cubicInterpolationMode: "monotone",
            yAxisID: "dust-y-axis", // Chỉ định trục Y cho Độ bụi
        },
    ],
};

const dustSensorChart = new Chart(document.getElementById("dust-sensor-chart"), {
    type: "line",
    data: dustSensorData,
    options: {
        responsive: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Thời gian",
                },
            },
            "dust-y-axis": { // Trục Y cho Độ bụi
                position: "left", // Vị trí ở bên trái
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Độ bụi",
                },
            },
        },
    },
    plugins: {
        legend: {
            display: true,
        },
        tooltip: {
            mode: "index",
        },
        scroll: {
            enabled: true,
            max: 10,
        },
    },
});


function getDustColor(randomValue) {
    if (randomValue >= 90) {
        return '#5a5656'; // Độ bụi lớn hơn hoặc bằng 90, màu đen
    } else if (randomValue >= 70) {
        return '#898282'; // Độ bụi từ 70 đến 80, màu darkgray
    } else if (randomValue >= 50) {
        return '#a8a1a1'; // Độ bụi từ 50 đến 60, màu gray
    } else if (randomValue >= 30) {
        return '#beb7b7'; // Độ bụi từ 30 đến 40, màu dimgray
    } else if (randomValue >= 10) {
        return '#d4cbcb'; // Độ bụi từ 10 đến 20, màu lightgray
    } else {
        return 'white'; 
    }
}

showDashboard();


// <II>---------------------Data Sensor (History)------------------------

function showHistory() {
    document.getElementById("dashboard-content").style.display = "none";
    document.getElementById("profile-content").style.display = "none";
    document.getElementById("history-content").style.display = "block";
    document.getElementById("action-content").style.display = "none";

    // Gọi hàm fetchHistoryData() để lấy dữ liệu mặc định
    fetchHistoryData();

}



// Biến để lưu trữ dữ liệu
let sensorData = [];

// Biến để theo dõi trang hiện tại
let currentPage = 1;
const recordsPerPage = 20;

function fetchHistoryData() {
    let apiUrl = 'http://172.20.10.2:5000/api/sensor-data';

    // Kiểm tra xem có thông tin bộ lọc không
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (startDate && endDate) {
        // Nếu có bộ lọc, gửi yêu cầu POST đến API "/api/sensor-data/filter"
        apiUrl = 'http://172.20.10.2:5000/api/sensor-data/filter';

        // Tạo dữ liệu bộ lọc
        const filterData = { start_date: startDate, end_date: endDate };

        // Gửi yêu cầu POST với dữ liệu bộ lọc
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filterData)
        })
            .then(response => response.json())
            .then(data => {
                const historyTable = document.getElementById('history-table').getElementsByTagName('tbody')[0];

                historyTable.innerHTML = '';

                data.forEach(item => {
                    const row = historyTable.insertRow();
                    row.insertCell(0).textContent = item.id;
                    row.insertCell(1).textContent = item.temperature + ' °C';
                    row.insertCell(2).textContent = item.humidity + ' %';
                    row.insertCell(3).textContent = item.light + ' lux';
                    row.insertCell(4).textContent = item.dust + ' %';
                    row.insertCell(5).textContent = item.time;
                });
                sensorData = data;
                displayData(currentPage);
                renderPagination();
            })
            .catch(error => {
                console.error('Error fetching history data:', error);
            });
    } else {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const historyTable = document.getElementById('history-table').getElementsByTagName('tbody')[0];
                historyTable.innerHTML = '';

                data.forEach(item => {
                    const row = historyTable.insertRow();
                    row.insertCell(0).textContent = item.id;
                    row.insertCell(1).textContent = item.temperature + ' °C';
                    row.insertCell(2).textContent = item.humidity + ' %';
                    row.insertCell(3).textContent = item.light + ' lux';
                    row.insertCell(4).textContent = item.dust + ' %';
                    row.insertCell(5).textContent = item.time;
                });
                sensorData = data;
                displayData(currentPage);
                renderPagination();
            })
            .catch(error => {
                console.error('Error fetching history data:', error);
            });
    }
    // Sự kiện khi người dùng nhập vào ô tìm kiếm
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = document.getElementById("history-table").getElementsByTagName("tbody")[0].rows;

        for (let i = 0; i < rows.length; i++) {
            const rowData = rows[i].textContent.toLowerCase();
            if (rowData.includes(searchTerm)) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    });
}


// ----------------Phân trang History---------------------
// Hiển thị dữ liệu cho trang hiện tại
function displayData(page) {
    const historyTable = document.getElementById('history-table').getElementsByTagName('tbody')[0];
    historyTable.innerHTML = '';

    const start = (page - 1) * recordsPerPage;
    const end = start + recordsPerPage;

    const dataToDisplay = sensorData.slice(start, end);

    dataToDisplay.forEach(item => {
        const row = historyTable.insertRow();
        row.insertCell(0).textContent = item.id;
        row.insertCell(1).textContent = item.temperature + ' °C';
        row.insertCell(2).textContent = item.humidity + ' %';
        row.insertCell(3).textContent = item.light + ' lux';
        row.insertCell(4).textContent = item.dust + ' %';
        row.insertCell(5).textContent = item.time;
    });
}

// Tạo các nút phân trang
function renderPagination() {
    const totalRecords = sensorData.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Xác định nút đầu tiên và nút cuối cùng
    let firstButton = currentPage - 2 > 1 ? currentPage - 2 : 1;
    let lastButton = firstButton + 4 < totalPages ? firstButton + 4 : totalPages;

    if (lastButton - firstButton < 4) {
        firstButton = lastButton - 4 > 1 ? lastButton - 4 : 1;
    }

    // Tạo nút "Trang đầu" và "Trang cuối"
    if (firstButton > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = '1';
        firstPageButton.addEventListener('click', () => {
            currentPage = 1;
            displayData(currentPage);
        });
        pagination.appendChild(firstPageButton);
    }

    for (let i = firstButton; i <= lastButton; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            displayData(currentPage);
            renderPagination(); // Cập nhật lại dòng nút phân trang
        });
        pagination.appendChild(button);
    }
    // Tạo nút "Trang cuối"
    if (lastButton < totalPages) {
        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = totalPages;
        lastPageButton.addEventListener('click', () => {
            currentPage = totalPages;
            displayData(currentPage);
        });
        pagination.appendChild(lastPageButton);
    }
}

// Sự kiện khi người dùng ấn nút "Tìm"
document.getElementById('search-button').addEventListener('click', fetchHistoryData);

// Gọi hàm fetchHistoryData ban đầu để hiển thị dữ liệu mặc định
fetchHistoryData();




// ---------------------Sắp xếp history-----------------------------
// Lấy các phần tử tiêu đề cột
const headers = document.querySelectorAll("#history-table th");

// Xác định trạng thái sắp xếp của từng cột
let sortOrders = Array(headers.length).fill("asc");

// Sắp xếp bảng dựa trên cột khi người dùng nhấp vào tiêu đề cột
headers.forEach((header, index) => {
    header.addEventListener("click", () => {
        const column = header.getAttribute("data-column");
        sortTable(column, sortOrders[index]);
        sortOrders[index] = (sortOrders[index] === "asc") ? "desc" : "asc";
    });
});

// Hàm sắp xếp bảng dựa trên cột và trạng thái sắp xếp
function sortTable(column, order) {
    const tbody = document.querySelector("#history-table tbody");
    const rows = Array.from(tbody.rows);

    rows.sort((a, b) => {
        const aValue = a.cells[column].textContent;
        const bValue = b.cells[column].textContent;

        if (order === "asc") {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });

    rows.forEach(row => tbody.appendChild(row));
}

// <III>--------------------------ACTION---------------------------
function showAction() {
    document.getElementById("dashboard-content").style.display = "none";
    document.getElementById("profile-content").style.display = "none";
    document.getElementById("history-content").style.display = "none";
    document.getElementById("action-content").style.display = "block";

    fetchActionData(); 
}




// Biến để lưu trữ dữ liệu
let sensorData1 = [];

// Biến để theo dõi trang hiện tại
let currentPage1 = 1;
const recordsPerPage1 = 20;
function fetchActionData() {
    let apiUrl = 'http://172.20.10.2:5000/api/action-data-light-fan';

    // Kiểm tra xem có thông tin bộ lọc không
    const startDate = document.getElementById('start-date1').value;
    const endDate = document.getElementById('end-date1').value;

    if (startDate && endDate) {
        // Nếu có bộ lọc, gửi yêu cầu POST đến API "/api/sensor-data/filter"
        apiUrl = 'http://172.20.10.2:5000/api/action-data-light-fan/filter';
        // Tạo dữ liệu bộ lọc
        const filterData = { start_date: startDate, end_date: endDate };

        // Gửi yêu cầu POST với dữ liệu bộ lọc
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filterData)
        })
            .then(response => response.json())
            .then(data => {
                const actionTable = document.getElementById('action-table').getElementsByTagName('tbody')[0];

                actionTable.innerHTML = '';

                data.forEach(item => {
                    const row = actionTable.insertRow();
                    row.insertCell(0).textContent = item.id;
                    row.insertCell(1).textContent = item.DeviceName;
                    row.insertCell(2).textContent = item.Status;
                    row.insertCell(3).textContent = item.time;
                });
                sensorData1 = data;
                displayData1(currentPage);
                renderPagination1();
            })
            .catch(error => {
                console.error('Error fetching action data:', error);
            });
    } else {
        // Nếu không có bộ lọc, tiếp tục gọi API "/api/sensor-data" để lấy 50 bản ghi mới nhất
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const actionTable = document.getElementById('action-table').getElementsByTagName('tbody')[0];
                actionTable.innerHTML = '';

                data.forEach(item => {
                    const row = actionTable.insertRow();
                    row.insertCell(0).textContent = item.id;
                    row.insertCell(1).textContent = item.DeviceName;
                    row.insertCell(2).textContent = item.Status;
                    row.insertCell(3).textContent = item.time;
                });
                sensorData1 = data;
                displayData1(currentPage);
                renderPagination1();
            })
            .catch(error => {
                console.error('Error fetching action data:', error);
            });
    }
    // Sự kiện khi người dùng nhập vào ô tìm kiếm, ĐƯỢC ĐẶT Ở NGAY SAU KHI DỮ LIỆU ĐƯỢC ĐỔ VÀO BẢNG
    const searchInput1 = document.getElementById("search-input1");
    searchInput1.addEventListener("input", () => {
        const searchTerm = searchInput1.value.toLowerCase();
        const rows = document.getElementById("action-table").getElementsByTagName("tbody")[0].rows;

        for (let i = 0; i < rows.length; i++) {
            const rowData = rows[i].textContent.toLowerCase();
            if (rowData.includes(searchTerm)) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    });
}



// ----------------phân trang action---------------------
// Hiển thị dữ liệu cho trang hiện tại
function displayData1(page) {
    const actionTable = document.getElementById('action-table').getElementsByTagName('tbody')[0];
    actionTable.innerHTML = '';

    const start = (page - 1) * recordsPerPage;
    const end = start + recordsPerPage;

    const dataToDisplay = sensorData1.slice(start, end);

    dataToDisplay.forEach(item => {
        const row = actionTable.insertRow();
        row.insertCell(0).textContent = item.id;
        row.insertCell(1).textContent = item.DeviceName;
        row.insertCell(2).textContent = item.Status;
        row.insertCell(3).textContent = item.time;
    });
}

// Tạo các nút phân trang
function renderPagination1() {
    const totalRecords = sensorData1.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const pagination = document.getElementById('pagination1');
    pagination.innerHTML = '';

    // Xác định nút đầu tiên và nút cuối cùng
    let firstButton = currentPage - 2 > 1 ? currentPage - 2 : 1;
    let lastButton = firstButton + 4 < totalPages ? firstButton + 4 : totalPages;

    // Bảo đảm rằng không bao giờ có ít hơn 5 nút
    if (lastButton - firstButton < 4) {
        firstButton = lastButton - 4 > 1 ? lastButton - 4 : 1;
    }

    // Tạo nút "Trang đầu" và "Trang cuối"
    if (firstButton > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = '1';
        firstPageButton.addEventListener('click', () => {
            currentPage = 1;
            displayData1(currentPage);
        });
        pagination.appendChild(firstPageButton);
    }

    for (let i = firstButton; i <= lastButton; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            displayData1(currentPage);
            renderPagination1(); // Cập nhật lại dòng nút phân trang
        });
        pagination.appendChild(button);
    }
    // Tạo nút "Trang cuối"
    if (lastButton < totalPages) {
        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = totalPages;
        lastPageButton.addEventListener('click', () => {
            currentPage = totalPages;
            displayData1(currentPage);
        });
        pagination.appendChild(lastPageButton);
    }
}



// Sự kiện khi người dùng ấn nút "Tìm"
document.getElementById('search-button1').addEventListener('click', fetchActionData);

// Gọi hàm fetchHistoryData ban đầu để hiển thị dữ liệu mặc định
fetchActionData();




// ---------------------sắp xếp action-----------------------------
// Lấy các phần tử tiêu đề cột
const headers1 = document.querySelectorAll("#action-table th");

// Xác định trạng thái sắp xếp của từng cột
let sortOrders1 = Array(headers1.length).fill("asc");

// Sắp xếp bảng dựa trên cột khi người dùng nhấp vào tiêu đề cột
headers1.forEach((header1, index) => {
    header1.addEventListener("click", () => {
        const column = header1.getAttribute("data-column");
        sortTable1(column, sortOrders1[index]);
        sortOrders1[index] = (sortOrders1[index] === "asc") ? "desc" : "asc";
    });
});

// ---------sắp xếp action--------------
function sortTable1(column, order) {
    const tbody = document.querySelector("#action-table tbody");
    const rows = Array.from(tbody.rows);

    rows.sort((a, b) => {
        const aValue = a.cells[column].textContent;
        const bValue = b.cells[column].textContent;

        if (order === "asc") {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });

    rows.forEach(row => tbody.appendChild(row));
}



// <IV>---------------------PROFILE---------------------------------
function showProfile() {
    document.getElementById("dashboard-content").style.display = "none";
    document.getElementById("profile-content").style.display = "flex";
    document.getElementById("history-content").style.display = "none";
    document.getElementById("action-content").style.display = "none";
}