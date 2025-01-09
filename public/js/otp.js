    document.getElementById("otp").focus();

    let timer = 60;
    let timerInterval;

    function startTimer() {
        timerInterval = setInterval(() => {
            timer--;
            document.getElementById("timerValue").textContent = timer;
            if (timer <= 0) {
                clearInterval(timerInterval);
                document.getElementById("timerValue").classList.add("expired");
                document.getElementById("timerValue").textContent = "Expired";
                document.getElementById("otp").disabled = true;
            }
        }, 1000);
    }
    startTimer();

function validateOTPForm() {
    const otpInput = document.getElementById("otp").value;
    $.ajax({
        type:"POST",
        url:"verify-otp",
        data:{otp:otpInput},
        success:function(response){
            if(response.success){
                Swal.fire({
                    icon:"success",
                    title:"OTP verified successfully",
                    showConfirmButon:false,
                    timer:1500,
                }).then(() => {
                    window.location.href = response.redirectUrl;
                })
            }else{
                Swal.fire({
                    icon:"error",
                    title:Error,
                    text:response.message
                })
            }
        },
        error: function (){
            Swal.fire({
                icon:"error",
                title:"Invalid OTP",
                text:"please try again"
            })
        }
    })
    return false;
}

function resendOTP() {
    // Reset the timer and re-enable the OTP input field
    clearInterval(timerInterval);
    timer = 60;
    document.getElementById("otp").disabled = false;
    document.getElementById("timerValue").classList.remove("expired"); // Fixed capitalization
    document.getElementById("timerValue").textContent = timer;
    startTimer();

    // AJAX call to resend the OTP
    $.ajax({
        type: "POST",
        url: "resend-otp", // Ensure this matches your backend route
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    icon: "success", // Fixed icon capitalization
                    title: "OTP resent successfully", // Improved grammar
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An error occurred while resending the OTP. Please try again.", // Fixed typo and grammar
                });
            }
        },
        error: function () {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An unexpected error occurred. Please try again.",
            });
        },
    });

    // No need for `return false` here
}
