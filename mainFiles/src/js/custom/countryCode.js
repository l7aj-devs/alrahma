const code = {
    C1: "sa",// "Saudi Arabia",
    C2: "sd",// "Sudan",
    C3: "us",// "United States",
    C4: "eg",// "Egypt",
    C5: "ss",// "South Sudan",
    C6: "ma",// "Morocco",
    C7: "dz",// "Algeria",
    C8: "tn",// "Tunisia",
    C9: "ly",// "Libya",
    C10: "fr",// "France",
    C11: "es",// "Spain",
    C12: "gb",// "United Kingdom",
    C13: "de",// "Germany",
    C14: "ru",// "Russia",
    C15: "jp",// "Japan",
    C16: "kr",// "South Korea",
    C17: "kp",// "North Korea",
    C18: "hk",// "Hong Kong",
    C19: "cn",// "China",
    C20: "cn",// "China",
    C21: "lb",// "Lebanon",
    C22: "jo",// "Jordan",
    C23: "sy",// "Syria",
    C24: "iq",// "Iraq",
    C25: "kw",// "Kuwait",
    C26: "ye",// "Yemen",
    C27: "om",// "Oman",
    C28: "ae",// "United Arab Emirates",
    C29: "ps",// "Palestine",
    C30: "bh",// "Bahrain",
    C31: "qa",// "Qatar",
    C32: "bt",// "Bhutan",
    C33: "cn" // "China",
};
        
function initializeSelect2() {    
    let lengthCountryCode = $(".country-code").length;
    if ($("#details_donation").length) {
        for (let i = lengthCountryCode - 1; i <= $(".country-code").length; i++) {
            $($(".country-code")[i]).select2({
                templateResult: formatState
            })
        }
    }
    else {
        $(".country-code").select2({
            templateResult: formatState
        });
    }
   
    $(".select2-selection__arrow").text("");
    // $(".select2-selection__arrow").addClass("fas fa-chevron-down").attr("aria-hidden", "true");
    $('.country-code').off('change').on('change', function(){
        showOnlyCountryCode(this)
    })

    $('.country-code').off('select2:open').on('select2:open', function(){
        const container = this.parentElement.offsetWidth;
        const select2Width = document.querySelector('.select2-dropdown');
        setTimeout(function(){
                select2Width.style.setProperty('--select2-width', `${container}px`);
        }, 0)
    })

    $('.country-code').off('select2:close').on('select2:close', function(){
        onSelectClosed(this)
    })
    const countryCodeId = [...document.querySelectorAll('.country-code')];
    countryCodeId.forEach(dropdown => showOnlyCountryCode(dropdown));
    //[...document.querySelectorAll(".input-gifteeNumber")].forEach(phone => phone.onchange = cleanPhoneNumber);
};
        
function formatState (state) {
    if (!state.id) {
        return state.text;
    }
    var baseUrl = "https://flagcdn.com/16x12";
    var $state = $(
    `<span><img src="${baseUrl}/${code[`C${state.element.value.toLowerCase()}`]}.png" class="img-flag align-baseline me-2" />${state.text}</span>`
    );
    return $state;
};

function showOnlyCountryCode(countryCodeEl){
    [countryCode] = countryCodeEl.options[countryCodeEl.selectedIndex].text.split(" ");
    $(countryCodeEl).next('.select2').find('.select2-selection__rendered').text(countryCode)
}

$.validator.addMethod("gifteeNumberRequired", $.validator.methods.required, "رقم جوال المهدى إليه مطلوب");
$.validator.addMethod("gifteeNumberRegex", $.validator.methods.regex, "رقم جوال غير صحيح");
$.validator.addMethod("gifteeNumberMaxlength", $.validator.methods.maxlength, "رقم جوال غير صحيح");
$.validator.addMethod("gifteeNumberMinlength", $.validator.methods.minlength, "رقم جوال غير صحيح");

$.validator.addClassRules("input-gifteeNumber", {
    gifteeNumberRequired: true,
    gifteeNumberMaxlength: 9,
    gifteeNumberRegex: '^(5)[0-9]{8}$'

});

function onSelectClosed(countryCodeEl){
    
    const selectedOptionValue = countryCodeEl.options[countryCodeEl.selectedIndex].value;
    let phoneNumberEl = countryCodeEl.closest(".mobile-container").querySelector(".input-gifteeNumber");
    
    if (selectedOptionValue == 1) {

        $.validator.classRuleSettings['input-gifteeNumber'].gifteeNumberMaxlength = 9;
        $.validator.classRuleSettings['input-gifteeNumber'].gifteeNumberRegex = '^(5)[0-9]{8}$';


        phoneNumberEl.setAttribute("placeholder", "5xxxxxxxx");
        phoneNumberEl.setAttribute("maxlength", "9");

        $.validator.addClassRules(`input-gifteeNumber-${phoneNumberEl.dataset.id}`, {
            gifteeNumberRequired: true,
            gifteeNumberMaxlength: 9,
            gifteeNumberRegex: '^(5)[0-9]{8}$'
        });

    } else {

        $.validator.classRuleSettings['input-gifteeNumber'].gifteeNumberMaxlength = 13;
        $.validator.classRuleSettings['input-gifteeNumber'].gifteeNumberMinlength = 5;
        $.validator.classRuleSettings['input-gifteeNumber'].gifteeNumberRegex = '^[0-9]{5,13}$';

        phoneNumberEl.setAttribute("placeholder", "xxxxxxxx")
        phoneNumberEl.setAttribute("maxlength", "13");
        phoneNumberEl.setAttribute("minlength", "5");
        $.validator.addClassRules(`input-gifteeNumber-${phoneNumberEl.dataset.id}`, {
            gifteeNumberRequired: true,
            gifteeNumberMaxlength: 13,
            gifteeNumberMinlength: 5,
            gifteeNumberRegex: '^[0-9]{5,13}$'
        });
    }
}

// $.validator.messages = {
//     required: "This field is required.",
//     remote: "Please fix this field.",
//     email: "Please enter a valid email address.",
//     url: "Please enter a valid URL.",
//     date: "Please enter a valid date.",
//     dateISO: "Please enter a valid date (ISO).",
//     number: "Please enter a valid number.",
//     digits: "Please enter only digits.",
//     equalTo: "Please enter the same value again.",
//     maxlength: $.validator.format( "Please enter no more than {0} characters." ),
//     minlength: $.validator.format( "Please enter at least {0} characters." ),
//     rangelength: $.validator.format( "Please enter a value between {0} and {1} characters long." ),
//     range: $.validator.format( "Please enter a value between {0} and {1}." ),
//     max: $.validator.format( "Please enter a value less than or equal to {0}." ),
//     min: $.validator.format( "Please enter a value greater than or equal to {0}." ),
//     step: $.validator.format( "Please enter a multiple of {0}." )
// }
// $.validator.addMethod("gifteeNumberRequired", $.validator.methods.required, "رقم جوال المهدى إليه مطلوب");
// $.validator.addMethod("gifteeNumberRegex", $.validator.methods.regex, "رقم جوال غير صحيح");
// $.validator.addMethod("gifteeNumberMaxlength", $.validator.methods.maxlength, "رقم جوال المهدى إليه غير صحيح");

// $.validator.addClassRules("input-gifteeNumber", {
//     gifteeNumberRequired: true,
//     gifteeNumberMaxlength: 9,
//     gifteeNumberRegex: '^(5)[0-9]{8}$'

// });

// clean input phone number as below:
// cannot start with zero
// cannot start with country code
//const cleanPhoneNumber = function(e) {
//    e.preventDefault();
//    const countryCodeDropdown = this.closest(".mobile-container").querySelector(".select2-selection__rendered").textContent.split("+").join("");
//    //const countryCode = countryCodeDropdown.options[countryCodeDropdown.selectedIndex].text.split(" ")[0].replace("+", "");
//    var pastedText = "";
//    if (window.clipboardData && window.clipboardData.getData) {
//        // IE
//        pastedText = window.clipboardData.getData("Text");
//    } else if (e.clipboardData && e.clipboardData.getData) {
//        pastedText = e.clipboardData.getData("text/plain");
//    }
//    const reg = new RegExp(`^0|${countryCodeDropdown}+`, "");
//    var x = this.value.replace(reg, "");
//    this.value = x.replace(/\D/g, "");
//};
        
$(document).ready(function(){
    initializeSelect2();
});