$(document).ready(function() {
    refreshCaptcha();
    jQuery.validator.addMethod('user_rule', function(value, element) {
        if (/^(?=[a-z0-9._]{5,13}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(value)) {
            return true;
        } else {
            return false;
        };
    });

    jQuery.validator.addMethod('name_rule', function(value, element) {
        if (/^[a-zA-Z]+(?:\s[a-zA-Z]+)+$/.test(value)) {
            return true;
        } else {
            return false;
        };
    });

    jQuery.validator.addMethod('phone_rule', function(value, element) {
        // if (/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(value)) {
        if (/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value)) {
            return true;
        } else {
            return false;
        };
    });

    $("#contact-form").submit(function(e) {
        e.preventDefault();
    }).validate({
        rules: {
            'agentid': {
                required: true,
                user_rule: true
            },
            'password': {
                required: true,
                minlength: 8
            },
            'name': {
                required: true,
                name_rule: true
            },
            'mobile': {
                required: true,
                phone_rule: true
            },
            'captcha': {
                required: true,
            }
        },
        messages: {
            'agentid': "Tên đại lý không viết hoa, ký tự đặc biệt, lớn hơn 5 ký tự và nhỏ hơn 13 ký tự.",
            'password': 'Mật khẩu tối thiểu 8 ký tự',
            'name': 'Vui lòng nhập đầy đủ họ và tên không dấu',
            'mobile': 'Vui lòng nhập đúng số điện thoại',
            'captcha': 'Vui lòng nhập mã xác thực'
        },

        submitHandler: function(form) {
            onClickReg();
            return false;
        }
    });

});

function refreshCaptcha() {
    fetch('https://api.3547700.com/sandsv-ecp/api/v1/player/showinfo')
        .then(response => response.json())
        .then((data) => {
            $("#imgCaptcha").attr("src", data.image);
            $("#captchauuid").val(data.uuid);
            $("#captcha").val("");
        });
}

refreshCaptcha();

function onClickReg() {
    $("#submit-button-reg").prop('disabled', true);

    var pass2 = document.getElementById("password").value;
    var agentid = document.getElementById("agentid").value;
    var name = document.getElementById("name").value;
    var mobile = "84 " + document.getElementById("mobile").value.substring(1);
    var portalid = document.getElementById("portalid").value;
    var captcha = document.getElementById("captcha").value;
    var passsha = Crypto.sha1_hmac(pass2, agentid);
    var currency = "VND2";
    var captchauuid = document.getElementById("captchauuid").value;
    var ulagentFlag = true;
    var registerFp = document.getElementById("registerFp").value;

    fetch("./checkAgent.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: `agentid=${agentid}&password=${passsha}&name=${name}&mobile=${mobile}&portalid=${portalid}&currency=${currency}&captcha=${captcha}&captchauuid=${captchauuid}&ulagentFlag=${ulagentFlag}&registerFp=${registerFp}`,
        })
        .then((response) => response.text())
        .then((res) => {
            if (res === "success") {
                document.getElementById("modal-text").innerHTML = "Đăng ký tài khoản đại lý thành công, vui lòng liên hệ chuyên viên đại lý Hi88 để kích hoạt tài khoản!";
                $('#exampleModalToggle').modal('show');
            } else if (res === "captchaIsInvalid") {
                document.getElementById("modal-text").innerHTML = "Mã captcha không hợp lệ, vui lòng thử lại.";
                $('#exampleModalToggle').modal('show');
            } else if (res === "registerAccountExist") {
                document.getElementById("modal-text").innerHTML = "Tài khoản đại lý đã được đăng ký, vui lòng thử lại.";
                $('#exampleModalToggle').modal('show');
            } else if (res === "inValidPhoneNumber") {
                document.getElementById("modal-text").innerHTML = "Số điện thoại không hợp lệ, vui lòng thử lại.";
                $('#exampleModalToggle').modal('show');
            } else if (res === "existAgentId") {
                document.getElementById("modal-text").innerHTML = "Tài khoản đại lý đã được đăng ký, vui lòng thử lại.";
                $('#exampleModalToggle').modal('show');
            } else if (res === "existMobile") {
                document.getElementById("modal-text").innerHTML = "Số điện thoại đã được đăng ký, vui lòng thử lại.";
                $('#exampleModalToggle').modal('show');
            } else {
                document.getElementById("modal-text").innerHTML = "Có lỗi xảy ra khi đăng ký, vui lòng thử lại.";
                $('#exampleModalToggle').modal('show');
                console.log(res);
            }
        });

    $("#submit-button-reg").prop('disabled', false);
}


window.onscroll = function() {
    myFunction()
};

var header = document.getElementById("myHeader");
var sticky = header.offsetTop;

function myFunction() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
};

$('.list-banner').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: '',
    // fade: true,

    prevArrow: `<button type='button' class='slick-prev pull-left btn-arrow'><ion-icon name="chevron-back-outline"></ion-icon></button>`,
    nextArrow: `<button type='button' class='slick-next pull-right btn-arrow'><ion-icon name="chevron-forward-outline"></ion-icon></ion-icon></button>`,

    responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                arrows: false,
            },
        },
        {
            breakpoint: 1008,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                arrows: false,
                fade: false,
                dots: false,
            },
        },
    ],
});

// close modal
$('.close-modal').on('click', function() {
    $('#exampleModalToggle').modal('hide');
    refreshCaptcha();
});

//Close gif 
$('#close-gif-left').on('click', function() {
    $('.gif-left').hide()
});

$('#close-gif-right').on('click', function() {
    $('.gif-right').hide()
})

$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})