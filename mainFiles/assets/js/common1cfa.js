/*
    Accessible Overlays
    Provides compliance with WTAG2.1 by insuring operability and focusability of modals and overlays to be used with navigation menus and Quick Donation overlays
    Params:
        overlay: JQuery Selector for the overlay parent. All overlay elements should be inside this parent.
        openBtn: jQuery selector for the overlay open element. Focus will be returned to this element upon overlay closure.
        closeBtn: jQuery selector for the overlay closure element. This element will receive a click event if escapeToClose is true and should handle overlay unloading on its own.
        trapFocus: boolian that defaults to true, will trap tap focus inside the overlay when it's opened.
        escapeToClose: boolian that defaults to true, will close the overlay upon pressing escape key.
        exclude: jQuery selector for excluded elements. These elements will not be hidden from the accessibility API and their tab indexes won't change. This parameter is not required.
        focusOnOpen: jQuery selector for the element which receives focus upon overlay opening.
    Optional Attributes:
        data-srOpenNotification: a string that should be announced to screen readers automatically when opening the overlay. This HTML Attribute should be set on the overlay parent.
        data-srCloseNotification: a string that should be announced to screen readers automatically when closing the overlay. This HTML Attribute should be set on the overlay parent.
*/

AccessibleOverlay = function (
  overlay,
  openBtn,
  closeBtn,
  trapFocus = true,
  escapeToClose = true,
  exclude,
  focusOnOpen = null
) {
  this.overlay = overlay
  this.exclude = exclude
  this.overlayState = false
  this.trapFocus = trapFocus
  this.escapeToClose = escapeToClose
  this.openBtn = openBtn
  this.closeBtn = closeBtn
  this.focusOnOpen = focusOnOpen
  this.overlayNodes, this.nonOverlayNodes

  this.trapFocusManager = function () {
    if (this.overlayState) {
      $(this.overlay)
        .off('keydown')
        .on('keydown', (e) => {
          if (e.which === 9) {
            let tabbable = $(this.overlay)
              .find('select, input, textarea, button, a, [tabindex="0"]')
              .filter(':visible')

            if (tabbable.length === 0) {
              e.preventDefault()
              return
            }

            let firstTabbable = tabbable.first()
            let lastTabbable = tabbable.last()

            // Redirect last tab to first input, and first Shift+Tab to last input
            if (e.shiftKey && $(document.activeElement).is(firstTabbable)) {
              e.preventDefault()
              lastTabbable.focus()
            } else if (
              !e.shiftKey &&
              $(document.activeElement).is(lastTabbable)
            ) {
              e.preventDefault()
              firstTabbable.focus()
            }
          }
        })
    } else {
      $(this.overlay).off('keydown')
    }
  }
  this.openOverlay = function () {
    if (this.focusOnOpen) $(this.focusOnOpen).focus()
    this.overlayNodes = $(`${this.overlay} *`).toArray()
    this.nonOverlayNodes = $(
      `body *:not(${this.exclude}, #srNotificationArea, [aria-hidden="true"], [aria-hidden="true"] *, [tabindex="-1"], [tabindex="-1"] *, script, ${this.overlay})`
    ).toArray()
    for (let i = 0; i < this.nonOverlayNodes.length; i++) {
      let node = this.nonOverlayNodes[i]

      if (!this.overlayNodes.includes(node)) {
        // save the previous tabindex state so we can restore it on close
        node._prevTabindex = node.getAttribute('tabindex')
        node._prevAriaHidden = node.getAttribute('aria-hidden')
        $(node).attr('tabindex', '-1').attr('aria-hidden', 'true')

        // tabindex=-1 does not prevent the mouse from focusing the node (which
        // would show a focus outline around the element). prevent this by disabling
        // outline styles while the modal is open
        // @see https://www.sitepoint.com/when-do-elements-take-the-focus/
        // node.style.outline = 'none';
      }
    }
    this.overlayState = true
    if (this.trapFocus) this.trapFocusManager()
    if (this.escapeToClose && this.overlayState) {
      let self = this
      $(this.overlay).on('keyup', (e) => {
        if (e.keyCode === 27) {
          e.preventDefault()
          $(self.closeBtn)[0].click()
        }
      })
    }
    if ($(this.overlay).attr('data-srOpenNotification')) {
      $('#srNotificationArea').html(
        $(this.overlay).attr('data-srOpenNotification')
      )
    }
    // If an overlay took too long to be opened, focus won't be set since elements are still hidden
    // call focus again to insure focusability.
    if (
      this.focusOnOpen &&
      !$(document.activeElement).is($(this.focusOnOpen))
    ) {
      setTimeout(function () {
        $(this.focusOnOpen).focus()
      }, 100)
    }
  }

  this.closeOverlay = function () {
    for (let i = 0; i < this.nonOverlayNodes.length; i++) {
      let node = this.nonOverlayNodes[i]
      if (!this.overlayNodes.includes(node)) {
        if (node._prevTabindex) {
          node.setAttribute('tabindex', node._prevTabindex)
          node._prevTabindex = null
        } else {
          node.removeAttribute('tabindex')
        }
        if (node._prevAriaHidden) {
          node.setAttribute('aria-hidden', node._prevAriaHidden)
          node._prevAriaHidden = null
        } else {
          node.removeAttribute('aria-hidden')
        }
      }
    }
    this.overlayState = false
    if (this.trapFocus) this.trapFocusManager()
    if (!this.overlayState && this.escapeToClose) {
      $(this.overlay).off('keyup')
    }
    if ($(this.openBtn)) $(this.openBtn).focus()
    if ($(this.overlay).attr('data-srCloseNotification')) {
      $('#srNotificationArea').html(
        $(this.overlay).attr('data-srCloseNotification')
      )
    }
  }
}

/*
    handleKeyboardQdEdit
    Used to simulate a click on edit button in QD Payment form by intersepting return and space keys.
    All other logic shall be intact and executed upon clicking the element
*/

function handleKeyboardQDEdit(element, event) {
  if (event.keyCode === 32 || event.keyCode === 13) {
    event.preventDefault()
    $(element).click()
  }
}

/*
    handleSearchSubmit
    Used to simulate a click on search button in search boxes of Tyassarat and Forijat pages by intersepting return key.
    All other logic shall be intact and executed upon clicking the element
*/

function handleSearchSubmit(element, event) {
  if (event.keyCode === 13) {
    event.preventDefault()
    $(element).click()
  }
}

function handleSwiperPauseButton(e, mySwiper) {
  if (mySwiper[0].autoplay.running && mySwiper[1].autoplay.running) {
    mySwiper[0].autoplay.stop()
    mySwiper[1].autoplay.stop()
    $(e.target).attr('aria-pressed', 'true')
  } else {
    mySwiper[0].autoplay.start()
    mySwiper[1].autoplay.start()
    $(e.target).attr('aria-pressed', 'false')
  }
}

function toggleFixedMenu() {
  $('.fixed-side-menu').toggleClass('has-focus')
  $('.fixed-side-menu').hasClass('has-focus')
    ? window.qdOverlay.openOverlay()
    : window.qdOverlay.closeOverlay()
}

function Clipboard_CopyTo(value) {
  var tempInput = document.createElement('input')
  tempInput.value = value
  document.body.appendChild(tempInput)
  tempInput.select()
  document.execCommand('copy')
  document.body.removeChild(tempInput)
}

function createMockedLinks() {
  $('a.card-details-link').each(function (index, item) {
    var parent = $(item).parent()
    var anchorHtml = $(item).html()
    var linkValue = $(item).attr('href')
    var mockDiv = $(
      "<div class='replaced-link' onclick='doNavigate(\"" +
        linkValue +
        '")\'></div>'
    )
    mockDiv.html(anchorHtml)
    if ($(item).attr('role')) $(mockDiv).attr('role', $(item).attr('role'))
    if ($(item).attr('tabindex'))
      $(mockDiv).attr('tabindex', $(item).attr('tabindex'))
    if ($(item).attr('aria-hidden'))
      $(mockDiv).attr('aria-hidden', $(item).attr('aria-hidden'))
    if ($(mockDiv).find('img').length > 0) {
      $(mockDiv).removeAttr('role').removeAttr('tabindex')
    }
    $(item).empty().attr('aria-hidden', 'true').attr('tabindex', '-1')
    parent.prepend(mockDiv)
  })
}

$(createMockedLinks())

function doNavigate(url) {
  window.location.href = url
}

document.addEventListener('DOMContentLoaded', (event) => {
  $(document).on('wheel', 'input[type=number]', function (e) {
    $(this).blur()
  })

  //Bootstrap fix for radio buttons keyboard changing bug
  $(document).on(
    'click',
    '[data-toggle^="button"] input[type="radio"]',
    function (event) {
      // Bootstrap will call event.preventDefault() which results into a reset of the radio buttons before the keyboard input.
      // To work around this, we set the method to one without side effects.
      event.preventDefault = () => true
    }
  )

  $('#account-modal').modal({
    showClose: false,
  })

  $('.hideCloseButton').modal({
    showClose: false,
  })

  try {
    window.drawer = tinyDrawer()
  } catch (e) {}

  // Scroll Header Listener
  let scrollpos = window.scrollY
  const header = document.querySelector('header')
  const header_height = header.offsetHeight

  const add_class_on_scroll = () => header.classList.add('opaque')
  const remove_class_on_scroll = () => header.classList.remove('opaque')

  window.addEventListener('scroll', function () {
    scrollpos = window.scrollY

    if (scrollpos >= 100) {
      add_class_on_scroll()
    } else {
      remove_class_on_scroll()
    }
  })

  $(document).ready(function () {
    $('.select2-selection__arrow').text('')
    $('.select2-selection__arrow')
      .addClass('fas fa-chevron-down')
      .attr('aria-hidden', 'true')
    $('.card-filter--btn_show').click(function () {
      $('.card-filter--body').fadeIn()
      $('.card-filter--btn_hide').focus()
    })
    $('.card-filter--btn_hide').click(function () {
      $('.card-filter--body').fadeOut()
      $('.card-filter--btn_show').focus()
    })
    $('.share-help').tipTop({ offsetVertical: 20, offsetHorizontal: 90 })
    $('.general-help').tipTop({ offsetVertical: 10, offsetHorizontal: 10 })

    if ($(document).scrollTop() > 100) {
      $('header').addClass('opaque')
    }
  })

  $(function () {
    // init Bootstrap4 tooltip
    $('[data-toggle="tooltip"]').tooltip()

    // $('.all-projects a').on('click touchend', function (e) {
    //     if (e.cancelable) { // added by Moamen
    //         var link = $(this).attr('href');
    //         window.open(link, '_self');
    //     }
    //     return false;
    // });

    window.qdOverlay = new AccessibleOverlay(
      (overlay = 'div.fixed-side-menu'),
      (openBtn = '#qd-open'),
      (closeBtn = '#qd-close'),
      (trapFocus = true),
      (escapeToClose = true),
      (exclude = 'div.wrapper.layout-1'),
      (focusOnOpen = '#qd-options .active')
    )
    //When pressing enter on the ammount field, do not submit the form
    $('#qd_amount').keypress(function (e) {
      if (e.which == 13) {
        e.preventDefault()
        $('#qd-checkout-buuton').click()
      }
    })
  })

  //paymentFormValidationQuickDonation('#fixed-side-menu-tab1 ')
  //paymentFormValidationQuickDonation("#fixed-side-menu-tab2 ");
  //paymentFormValidationQuickDonation("#fixed-side-menu-tab3 ");
  //paymentFormValidationQuickDonation("#fixed-side-menu-tab4 ");
})

$.fn.inputFilter = function (inputFilter) {
  return this.on(
    'input keydown keyup mousedown mouseup select contextmenu drop',
    function () {
      if (inputFilter(this.value)) {
        this.oldValue = this.value
        this.oldSelectionStart = this.selectionStart
        this.oldSelectionEnd = this.selectionEnd
      } else if (this.hasOwnProperty('oldValue')) {
        this.value = this.oldValue
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
      } else {
        this.value = ''
      }
    }
  )
}

$(document).ready(function () {
  $('#cardNumber, #cvv, #expMonth, #expYear').inputFilter(function (value) {
    return /^\d*$/.test(value) // Allow digits only, using a RegExp
  })
})

function paymentFormValidation(parentSelector) {
  var ccErrors = []
  ccErrors[0] = 'الرجاء إدخال الاسم بالكامل'
  ccErrors[1] = 'الرجاء إدخال رقم بطاقة صحيح'
  ccErrors[2] = 'الرجاء إدخال رقم بطاقة صحيح'
  ccErrors[3] = 'الرجاء إدخال تاريخ صحيح'
  ccErrors[4] = 'الرجاء إدخال رمز أمان صحيح'
  ccErrors[5] = '*'

  var checkVisaMaster = function (value, isMada) {
    var src = $(parentSelector + ' #card-icon-image').attr('src')
    var lengthValidToCheck = value && (value.length == 6 || value.length == 16)
    if (isMada && isMada == true) {
      $(parentSelector + ' #cardNumber')
        .addClass('card-type-valid')
        .removeClass('card-type-invalid')

      if (src != '/assets/images/payment/mada.png') {
        $(parentSelector + ' #card-icon-image')
          .attr('src', '/assets/images/payment/mada.png')
          .attr('alt', 'بطاقة مدى')
      }
    } else if (lengthValidToCheck && value[0] == 4) {
      $(parentSelector + ' #cardNumber')
        .addClass('card-type-valid')
        .removeClass('card-type-invalid')

      if (src != '/assets/images/payment/visa.png') {
        $(parentSelector + ' #card-icon-image')
          .attr('src', '/assets/images/payment/visa.png')
          .attr('alt', 'Visa')
      }
    } else if (lengthValidToCheck && value[0] == 5) {
      $(parentSelector + ' #cardNumber')
        .addClass('card-type-valid')
        .removeClass('card-type-invalid')

      if (src != '/assets/images/payment/mastercard.png') {
        $(parentSelector + ' #card-icon-image')
          .attr('src', '/assets/images/payment/mastercard.png')
          .attr('alt', 'Master Card')
      }
    } else {
      $(parentSelector + ' #cardNumber')
        .removeClass('card-type-valid')
        .addClass('card-type-invalid')

      if (src != '/assets/images/payment/visa dimmed.svg') {
        $(parentSelector + ' #card-icon-image')
          .attr('src', '/assets/images/payment/visa dimmed.svg')
          .attr('alt', 'أدخل رقم بطاقة صحيح')
      }
    }
  }

  $(document).ready(function () {
    let val = $('#cardNumber').val()
    if (val) checkVisaMaster(val)
  })

  $('#cardNumber').on('input', function (e) {
    let val = $('#cardNumber').val()
    checkVisaMaster(val)
    var value = e.target.value
    if (value && (value.length == 6 || value.length == 16)) {
      $.ajax({
        type: 'POST',
        url: '/Payment/isMada',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: { bin: value.substring(0, 6) },
        success: function (response) {
          checkVisaMaster(value, response == true)
        },
        failure: function () {
          return checkVisaMaster(value)
        },
        error: function () {
          return checkVisaMaster(value)
        },
      })
    } else if (!value || (value && value.length < 6)) {
      checkVisaMaster('mock')
    }
  })

  $(parentSelector + ' form').validate({
    rules: {
      cartItemAmount: {
        required: true,
        minlength: 1,
        min: 1,
      },
      'PaymentInfo.Member': {
        required: true,
        pattern: '^[a-z|A-Z| ]+$',
        minlength: 5,
        maxlength: 50,
      },
      'PaymentInfo.CardNumber': {
        required: true,
        pattern: '^[\\d]{16}$',
        isCardValid: true,
      },
      'PaymentInfo.CVV': {
        required: true,
        pattern: '^[\\d]{3}$',
      },
      //"CVV": {
      //    required: true,
      //    pattern: "^[\\d]{3}$"
      //},
      'PaymentInfo.ExpYear': {
        monthYear: parentSelector,
      },
      'PaymentInfo.ExpMonth': {
        monthYear: parentSelector,
      },
    },
    messages: {
      cartItemAmount: {
        required: 'مبلغ التبرع غير صحيح',
        minlength: 'مبلغ التبرع غير صحيح',
        min: 'مبلغ التبرع غير صحيح',
      },
      'PaymentInfo.Member': {
        required: ccErrors[0],
        pattern: ccErrors[0],
        minlength: ccErrors[0],
        maxlength: ccErrors[0],
      },
      'PaymentInfo.CardNumber': {
        required: ccErrors[1],
        pattern: ccErrors[2],
        isCardValid: ccErrors[2],
      },
      'PaymentInfo.CVV': {
        required: ccErrors[4],
        pattern: ccErrors[4],
      },
      //"CVV": {
      //    required: ccErrors[5],
      //    pattern: ccErrors[5],
      //},
      'PaymentInfo.ExpMonth': {
        monthYear: ccErrors[3],
      },
      'PaymentInfo.ExpYear': {
        monthYear: ccErrors[3],
      },
    },
    errorPlacement: function (error, element) {
      var elementName = $(element).attr('name')
      if (
        elementName == 'PaymentInfo.ExpMonth' ||
        elementName == 'PaymentInfo.ExpYear'
      ) {
        if ($(parentSelector + ' #expiration-date span.error').length == 0)
          $(parentSelector + ' #expiration-date').append(error)
      }
      //else if (elementName == "error") {
      //    if ($(parentSelector + " #amount_input_2-error").length == 0)
      //        error.insertAfter($(element).parent());
      //}
      else {
        error.insertAfter(element)
      }
    },
    onfocusout: function (element, event) {
      var monthElem = $(parentSelector + ' #expMonth')
      var yearElem = $(parentSelector + ' #expYear')
      if (
        ($(element).is(monthElem) && $(event.relatedTarget).is(yearElem)) ||
        ($(element).is(yearElem) && $(event.relatedTarget).is(monthElem))
      ) {
      } else this.element(element)
    },
    errorElement: 'span',
  })

  $.validator.addMethod('monthYear', function (value, element) {
    var minMonth = new Date().getMonth() + 1
    var minYear = new Date().getFullYear()

    var monthElem = $(parentSelector + ' #expMonth')
    var yearElem = $(parentSelector + ' #expYear')

    var formMonth = monthElem.val()
    var formYear = yearElem.val()

    var month = parseInt(formMonth)
    var year = 2000 + parseInt(formYear)

    if (year > minYear && month > 0 && month < 13 && year > 0) {
      //monthElem.removeClass("error").addClass("valid");
      //yearElem.removeClass("error").addClass("valid");
      if ($(parentSelector + ' #expiration-date span.error').length > 0)
        $(parentSelector + ' #expiration-date span.error').remove()
      return true
    } else if (
      !formMonth ||
      month > 12 ||
      month == 0 ||
      (year == minYear && month < minMonth)
    ) {
      monthElem.removeClass('valid').addClass('error')
      yearElem.removeClass('valid').addClass('error')
      if ($(parentSelector + ' #expiration-date span.error').length > 0)
        $(parentSelector + ' #expiration-date span.error')
          .attr('id', 'expMonth-error')
          .text(ccErrors[3])
          .prop('style', true)
      return false
    } else if (!formYear || year < minYear || year > 2099 || year == 2000) {
      monthElem.removeClass('valid').addClass('error')
      yearElem.removeClass('valid').addClass('error')
      if ($(parentSelector + ' #expiration-date span.error').length > 0)
        $(parentSelector + ' #expiration-date span.error')
          .attr('id', 'expYear-error')
          .text(ccErrors[3])
          .prop('style', true)
      return false
    } else {
      monthElem.removeClass('error').addClass('valid')
      yearElem.removeClass('error').addClass('valid')
      return true
    }
  })

  $.validator.addMethod('pattern', function (value, element, regexp) {
    var re = new RegExp(regexp)
    return re.test(value)
  })

  $.validator.addMethod('isCardValid', function (value, element) {
    return $(element).hasClass('card-type-valid')
  })

  $(parentSelector + ' .card-dates input').focus(function () {
    this.value = ''
  })
}

function paymentFormValidationQuickDonation(parentSelector) {
  var ccErrors = []
  ccErrors[0] = 'الرجاء إدخال الاسم باللغة الإنجليزية'
  ccErrors[1] = 'يجب إدخال رقم البطاقة'
  ccErrors[2] = 'يوجد خطأ في رقم البطاقة'
  ccErrors[3] = 'يوجد خطأ بالتاريخ'
  ccErrors[4] = 'الرجاء إدخال CVV'
  ccErrors[5] = '*'

  var checkVisaMaster = function (value, isMada) {
    if (isMada && isMada == true) {
      $(parentSelector + '#cardNumber')
        .addClass('card-type-valid')
        .removeClass('card-type-invalid')
      $(parentSelector + '#card-icon-image')
        .attr('src', '/assets/images/payment/mada.png')
        .attr('alt', 'بطاقة مدى')
    } else if (value[0] == 4) {
      $(parentSelector + '#cardNumber')
        .addClass('card-type-valid')
        .removeClass('card-type-invalid')
      $(parentSelector + '#card-icon-image')
        .attr('src', '/assets/images/payment/visa.png')
        .attr('alt', 'Visa')
    } else if (value[0] == 5) {
      $(parentSelector + '#cardNumber')
        .addClass('card-type-valid')
        .removeClass('card-type-invalid')
      $(parentSelector + '#card-icon-image')
        .attr('src', '/assets/images/payment/mastercard.png')
        .attr('alt', 'Master Card')
    } else {
      $(parentSelector + '#cardNumber')
        .removeClass('card-type-valid')
        .addClass('card-type-invalid')
      $(parentSelector + '#card-icon-image')
        .attr('src', '/assets/images/payment/visa dimmed.svg')
        .attr('alt', 'أدخل رقم بطاقة صحيح')
    }
  }
  var isMadaChecked = false
  $(parentSelector + '#cardNumber').change(function (e) {
    var value = e.target.value
    if (value && (value.length == 6 || value.length == 16) && !isMadaChecked) {
      $.ajax({
        type: 'POST',
        url: '/Payment/isMada',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: { bin: value.substring(0, 6) },
        success: function (response) {
          checkVisaMaster(value, response == true)
        },
        failure: function () {
          checkVisaMaster(value)
        },
        error: function () {
          checkVisaMaster(value)
        },
      })
    } else if (!value || (value && value.length < 6)) {
      checkVisaMaster('mock')
    }
  })

  $(parentSelector + 'form').validate({
    rules: {
      editAmount: {
        required: true,
        min: 1,
        max: 1000000,
      },
      'PaymentInfo.Member': {
        required: true,
        pattern: '^[a-z|A-Z ]+$',
        minlength: 5,
        maxlength: 50,
      },
      'PaymentInfo.CardNumber': {
        required: true,
        pattern: '^[\\d]{16}$',
        isCardValid: true,
      },
      'PaymentInfo.CVV': {
        required: true,
        pattern: '^[\\d]{3}$',
      },
      CVV: {
        required: true,
        pattern: '^[\\d]{3}$',
      },
      'PaymentInfo.ExpYear': {
        monthYearExpiry: parentSelector,
      },
      'PaymentInfo.ExpMonth': {
        monthYearExpiry: parentSelector,
      },
    },
    messages: {
      'PaymentInfo.Member': {
        required: ccErrors[0],
        pattern: ccErrors[0],
        minlength: ccErrors[0],
        maxlength: ccErrors[0],
      },
      'PaymentInfo.CardNumber': {
        required: ccErrors[1],
        pattern: ccErrors[2],
        isCardValid: ccErrors[2],
      },
      'PaymentInfo.CVV': {
        required: ccErrors[4],
        pattern: ccErrors[4],
      },
      CVV: {
        required: ccErrors[5],
        pattern: ccErrors[5],
      },
      'PaymentInfo.ExpMonth': {
        monthYearExpiry: ccErrors[3],
      },
      'PaymentInfo.ExpYear': {
        monthYearExpiry: ccErrors[3],
      },
    },
    errorPlacement: function (error, element) {
      var elementName = $(element).attr('name')
      if (elementName == 'ExpMonth' || elementName == 'ExpYear') {
        if ($(parentSelector + '#expiration-date span.error').length == 0)
          $(parentSelector + '#expiration-date').append(error)
      }
      //else if (elementName == "editAmount") {
      //    error.insertBefore(element);
      //}
      else {
        error.insertAfter(element)
        if (elementName == 'editAmount') {
          showInputAmount('#fixed-side-menu-tab1')
          var inputElem = $('#fixed-side-menu-tab1 .payment-info-box input')
          inputElem.removeClass('toggle-hide').focus()
        }
      }
    },
    onfocusout: function (element, event) {
      var monthElem = $(parentSelector + ' #expMonth')
      var yearElem = $(parentSelector + ' #expYear')
      if (
        ($(element).is(monthElem) && $(event.relatedTarget).is(yearElem)) ||
        ($(element).is(yearElem) && $(event.relatedTarget).is(monthElem))
      ) {
      } else this.element(element)
    },

    errorElement: 'span',
    submitHandler: function (form) {
      form.submit()
    },
  })

  $.validator.addMethod(
    'monthYearExpiry',
    function (value, element, parentSelector) {
      var minMonth = new Date().getMonth() + 1
      var minYear = new Date().getFullYear()

      var monthElem = $(parentSelector + '#expMonth')
      var yearElem = $(parentSelector + '#expYear')

      var formMonth = monthElem.val()
      var formYear = yearElem.val()

      var month = parseInt(formMonth)
      var year = 2000 + parseInt(formYear)

      if (year > minYear && month > 0 && month < 13 && year > 0 && year < 100) {
        return true
      } else if (
        !formMonth ||
        month > 12 ||
        month == 0 ||
        (year == minYear && month < minMonth)
      ) {
        monthElem.removeClass('valid').addClass('error')
        yearElem.removeClass('valid').addClass('error')
        if ($(parentSelector + '#expiration-date span.error').length > 0)
          $(parentSelector + '#expiration-date span.error')
            .attr('id', 'expMonth-error')
            .css('display', 'inline')
            .text(ccErrors[3])
        return false
      } else if (!formYear || year < minYear || year > 2099 || year == 2000) {
        monthElem.removeClass('valid').addClass('error')
        yearElem.removeClass('valid').addClass('error')
        if ($(parentSelector + '#expiration-date span.error').length > 0)
          $(parentSelector + '#expiration-date span.error')
            .attr('id', 'expYear-error')
            .css('display', 'inline')
            .text(ccErrors[3])
        return false
      } else {
        monthElem.removeClass('error').addClass('valid')
        yearElem.removeClass('error').addClass('valid')
        return true
      }
    }
  )

  $.validator.addMethod('pattern', function (value, element, regexp) {
    var re = new RegExp(regexp)
    return re.test(value)
  })

  $.validator.addMethod('isCardValid', function (value, element) {
    return $(element).hasClass('card-type-valid')
  })

  $(parentSelector + ' .card-dates input').focus(function () {
    this.value = ''
  })
}

function paymentFormValidationPeriodicDonation(parentSelector) {
  var ccErrors = []
  ccErrors[0] = 'الرجاء إدخال الاسم بالكامل'
  ccErrors[1] = 'الرجاء إدخال رقم بطاقة صحيح'
  ccErrors[2] = 'الرجاء إدخال رقم بطاقة صحيح'
  ccErrors[3] = 'الرجاء إدخال تاريخ صحيح'
  ccErrors[4] = 'الرجاء إدخال رمز أمان صحيح'
  ccErrors[5] = '*'
  ccErrors[6] = 'الرجاء اختيار مجال التبرع'

  var checkVisaMaster = function (value, isMada) {
    if (isMada && isMada == true) {
      $(parentSelector + ' #cardNumber')
        .addClass('card-type-valid')
        .removeClass('card-type-invalid')
      $(parentSelector + ' #card-icon-image')
        .attr('src', '/assets/images/payment/mada.png')
        .attr('alt', 'بطاقة مدى')
    } else if (value[0] == 4) {
      $(parentSelector + ' #cardNumber')
        .addClass('card-type-valid')
        .removeClass('card-type-invalid')
      $(parentSelector + ' #card-icon-image')
        .attr('src', '/assets/images/payment/visa.png')
        .attr('alt', 'Visa')
    } else if (value[0] == 5) {
      $(parentSelector + ' #cardNumber')
        .addClass('card-type-valid')
        .removeClass('card-type-invalid')
      $(parentSelector + ' #card-icon-image')
        .attr('src', '/assets/images/payment/mastercard.png')
        .attr('alt', 'Master Card')
    } else {
      $(parentSelector + ' #cardNumber')
        .removeClass('card-type-valid')
        .addClass('card-type-invalid')
      $(parentSelector + ' #card-icon-image')
        .attr('src', '/assets/images/payment/visa dimmed.svg')
        .attr('alt', 'أدخل رقم بطاقة صحيح')
    }
  }
  var isMadaCheckedInInternalPages = false
  function isMada(value) {
    if (
      value &&
      (value.length === 6 || value.length === 16) &&
      !isMadaCheckedInInternalPages
    ) {
      $.ajax({
        type: 'POST',
        url: '/Payment/isMada',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: { bin: value.substring(0, 6) },
        success: function (response) {
          $('#cardNumber-error').hide()
          checkVisaMaster(value, response == true)
        },
        failure: function () {
          return checkVisaMaster(value)
        },
        error: function () {
          return checkVisaMaster(value)
        },
      })
    } else if (!value || (value && value.length < 6) || value.length === 16) {
      checkVisaMaster('mock')
    }
  }
  $(document).ready(function () {
    let val = $('#cardNumber').val()
    isMada(val)
  })
  $('#cardNumber').change(function (e) {
    var value = e.target.value
    isMada(value)
  })

  $(parentSelector + ' form').validate({
    rules: {
      //"cartItemAmount": {
      //    required: true,
      //    minlength: 1,
      //    min: 1,
      //},
      EhsanFieldId: {
        required: true,
      },
      CardHolderName: {
        required: true,
        pattern: '^[a-z|A-Z| ]+$',
        minlength: 5,
        maxlength: 50,
      },
      CardNumber: {
        required: true,
        pattern: '^[\\d]{16}$',
        isCardValid: true,
      },
      CVV: {
        required: true,
        pattern: '^[\\d]{3}$',
      },
      ExpYear: {
        monthYear: parentSelector,
      },
      ExpMonth: {
        monthYear: parentSelector,
      },
    },
    messages: {
      //"cartItemAmount": {
      //    required: "مبلغ التبرع غير صحيح",
      //    minlength: "مبلغ التبرع غير صحيح",
      //    min: "مبلغ التبرع غير صحيح"
      //},
      EhsanFieldId: {
        required: ccErrors[6],
      },
      CardHolderName: {
        required: ccErrors[0],
        pattern: ccErrors[0],
        minlength: ccErrors[0],
        maxlength: ccErrors[0],
      },
      CardNumber: {
        required: ccErrors[1],
        pattern: ccErrors[2],
        isCardValid: ccErrors[2],
      },
      CVV: {
        required: ccErrors[4],
        pattern: ccErrors[4],
      },
      ExpMonth: {
        monthYear: ccErrors[3],
      },
      ExpYear: {
        monthYear: ccErrors[3],
      },
    },
    errorPlacement: function (error, element) {
      var elementName = $(element).attr('name')
      if (elementName == 'ExpMonth' || elementName == 'ExpYear') {
        if ($(parentSelector + ' #expiration-date span.error').length == 0)
          $(parentSelector + ' #expiration-date').append(error)
      }
      //else if (elementName == "error") {
      //    if ($(parentSelector + " #amount_input_2-error").length == 0)
      //        error.insertAfter($(element).parent());
      //}
      else {
        error.insertAfter(element)
      }
    },
    onfocusout: function (element, event) {
      var monthElem = $(parentSelector + ' #expMonth')
      var yearElem = $(parentSelector + ' #expYear')
      if (
        ($(element).is(monthElem) && $(event.relatedTarget).is(yearElem)) ||
        ($(element).is(yearElem) && $(event.relatedTarget).is(monthElem))
      ) {
      } else this.element(element)
    },
    errorElement: 'span',
  })

  $.validator.addMethod('monthYear', function (value, element) {
    var minMonth = new Date().getMonth() + 1
    var minYear = new Date().getFullYear()

    var monthElem = $(parentSelector + ' #expMonth')
    var yearElem = $(parentSelector + ' #expYear')

    var formMonth = monthElem.val()
    var formYear = yearElem.val()

    var month = parseInt(formMonth)
    var year = 2000 + parseInt(formYear)

    if (year > minYear && month > 0 && month < 13 && year > 0) {
      //monthElem.removeClass("error").addClass("valid");
      //yearElem.removeClass("error").addClass("valid");
      if ($(parentSelector + ' #expiration-date span.error').length > 0)
        $(parentSelector + ' #expiration-date span.error').remove()
      return true
    } else if (
      !formMonth ||
      month > 12 ||
      month == 0 ||
      (year == minYear && month < minMonth)
    ) {
      monthElem.removeClass('valid').addClass('error')
      yearElem.removeClass('valid').addClass('error')
      if ($(parentSelector + ' #expiration-date span.error').length > 0)
        $(parentSelector + ' #expiration-date span.error')
          .attr('id', 'expMonth-error')
          .text(ccErrors[3])
          .prop('style', true)
      return false
    } else if (!formYear || year < minYear || year > 2099 || year == 2000) {
      monthElem.removeClass('valid').addClass('error')
      yearElem.removeClass('valid').addClass('error')
      if ($(parentSelector + ' #expiration-date span.error').length > 0)
        $(parentSelector + ' #expiration-date span.error')
          .attr('id', 'expYear-error')
          .text(ccErrors[3])
          .prop('style', true)
      return false
    } else {
      monthElem.removeClass('error').addClass('valid')
      yearElem.removeClass('error').addClass('valid')
      return true
    }
  })

  $.validator.addMethod('pattern', function (value, element, regexp) {
    var re = new RegExp(regexp)
    return re.test(value)
  })

  $.validator.addMethod('isCardValid', function (value, element) {
    return $(element).hasClass('card-type-valid')
  })

  $(parentSelector + ' .card-dates input').focus(function () {
    this.value = ''
  })
}

function checkoutAmount(rootSelector) {
//   window.callApplePayMerchant()
  var inputValue = +$(rootSelector + '.amount').val()
  if (inputValue < 50 || inputValue > 1000000) {
    if (inputValue > 1000000)
      $(rootSelector + ' .field-validation-error').html(
        "<span id='CartItems[0].amount - error'>مبلغ التبرع بين 50 و 1000000 درهم </span>"
      )
    else
      $(rootSelector + ' .field-validation-error').html(
        "<span id='CartItems[0].amount - error'>الرجاء إدخال مبلغ التبرع</span>"
      )
    $(rootSelector + '.amount').on('change paste', function () {
      var val = +$(this).val()
      if (val > 1000000) {
        $(rootSelector + ' .field-validation-error').html(
          "<span id='CartItems[0].amount - error'>مبلغ التبرع بين 50 و 1000000 درهم</span>"
        )
      } else if (val < 50) {
        $(rootSelector + ' .field-validation-error').html(
          "<span id='CartItems[0].amount - error'>الرجاء إدخال مبلغ التبرع</span>"
        )
      } else {
        $(rootSelector + ' .field-validation-error').empty()
      }
    })
  } else {
    $(rootSelector + ' .field-validation-error').empty()
    if (inputValue >= 50) {
      let amountQuick = $('.amount-quick')
      let qd_amount = $('.qd_amount')
      if (amountQuick.length) {
        amountQuick.each(function (index, element) {
          $(element).html(inputValue)
        })
      }
      if (qd_amount.length) {
        qd_amount.each(function (index, element) {
          $(element).val(inputValue)
        })
      }
      $(rootSelector + '.amount-display').html(inputValue)
      $('#editAmountBtn').attr(
        'aria-label',
        'المبلغ: ' + inputValue + ' ريال سعودي. اضغط لتعديل مبلغ التبرع'
      )
      $(rootSelector + ' .payment-info-box .amount').val(inputValue)
      $(rootSelector + '.quickDonationCollapse').collapse('show')
      $(rootSelector + '.amount-field').collapse('hide')
      /*
                Quick Donation Checkout Focus Management:
                If a user has Apple Pay and it's ready for use, clicking on the checkout button should move the focus to the apple pay donation button.
                If Apple pay is not available for use and the user is logged in, focus will be moved to the default saved card radio button.
                Otherwise, the focus will be moved to the card number input field.
            */
      if (!$('#apple-pay-button').hasClass('d-none')) {
        $('#apple-pay-button').focus()
      } else if ($('#collapseTwo').hasClass('show')) {
        $('#collapseTwo input[type=radio][checked]').focus()
      } else {
        $('#cardNumber').focus()
      }
      window.qdOverlay.trapFocusManager()
    }
  }
}

function menuItemListener(dropdownId = '') {
  let elem = document.getElementsByClassName('opened')[0]
  if (elem && (elem.id !== dropdownId || !dropdownId.startsWith('menu-'))) {
    elem.classList.remove('opened')
    setTimeout(() => {
      document.getElementById(dropdownId).classList.toggle('opened')
    }, 300)
  } else if (dropdownId.startsWith('menu-'))
    document.getElementById(dropdownId).classList.toggle('opened')
}

function openDrawer() {
  window.drawer.open()
}

function closeDrawer() {
  window.drawer.close()
}

var checkMax = function (input) {
  var inputVal = Number(input.val())
  var max = null
  if (input.data()) {
    max = input.data().max
  }
  if (max && inputVal > 0 && max < inputVal) {
    input.parent().addClass('error')
    return false
  } else {
    input.removeClass('error')
    return true
  }
}

var checkAmount = function (input) {
  var inputVal = Number(input.val())
  if (inputVal <= 0) {
    input.parent().addClass('error')
    return false
  } else {
    input.parent().removeClass('error')
    return true
  }
}

function parseHindiNumber(e) {
  var str = e.target.value
  str = str.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
    return d.charCodeAt(0) - 1632 // Convert Hindi numbers to arabic
  })
  $(e.target).val(str)
  $(e.target).trigger('change')
}

function convetNumberToCurrency(e) {
  var currentControl = $(e.target)
  var str = currentControl.val()

  str = str.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
    return d.charCodeAt(0) - 1632 // Convert Hindi numbers to arabic
  })
  valueBefore = str
  if (valueBefore != '') {
    var cursorPosition = getCaretPosition(e.target)
    var specialCharsBefore = getSpecialCharsOnSides(valueBefore)
    var number = removeThousandSeparators(valueBefore)
    var currentValue
    var allnumber = number.replace(getCommaSeparator(), '.')
    currentControl.val(allnumber !== '.' ? formatNumber(allnumber) : '')

    // if deleting the comma, delete it correctly
    if (
      currentValue == currentControl.val() &&
      currentValue ==
        valueBefore.substr(0, cursorPosition) +
          getThousandSeparator() +
          valueBefore.substr(cursorPosition)
    ) {
      currentControl.val(
        formatNumber(
          removeThousandSeparators(
            valueBefore.substr(0, cursorPosition - 1) +
              valueBefore.substr(cursorPosition)
          )
        )
      )
      cursorPosition--
    }

    // if entering comma for separation, leave it in there (as well support .000)
    var commaSeparator = getCommaSeparator()
    if (
      valueBefore.endsWith(commaSeparator) ||
      valueBefore.endsWith(commaSeparator + '0') ||
      valueBefore.endsWith(commaSeparator + '00') ||
      valueBefore.endsWith(commaSeparator + '000')
    ) {
      currentControl.val(
        currentControl.val() +
          valueBefore.substring(valueBefore.indexOf(commaSeparator))
      )
    }

    // move cursor correctly if thousand separator got added or removed
    var specialCharsAfter = getSpecialCharsOnSides(currentControl.val())
    if (specialCharsBefore[0] < specialCharsAfter[0]) {
      cursorPosition += specialCharsAfter[0] - specialCharsBefore[0]
    } else if (specialCharsBefore[0] > specialCharsAfter[0]) {
      cursorPosition -= specialCharsBefore[0] - specialCharsAfter[0]
    }
    setCaretPosition(e.target, cursorPosition)
    currentValue = currentControl.val()
  } else currentControl.val(str)
  currentControl.trigger('change')
}

function applyOnlyNumberCustom() {
  $('.only-number-with-paste').on('input', parseHindiNumber)
  $('.only-number-with-paste').on('change', function (e) {
    var numberRegex = /^([\u0660-\u0669]|[0-9])*$/g
    if (!numberRegex.test(e.target.value)) {
      e.target.value = ''
    }
  })
  $('.only-number-with-paste').on('keypress', function (event) {
    var englishAlphabetAndWhiteSpace = /^([\u0660-\u0669]|[0-9])*$/g
    var key = String.fromCharCode(event.which)
    if (
      event.keyCode == 8 ||
      event.keyCode == 37 ||
      event.keyCode == 39 ||
      englishAlphabetAndWhiteSpace.test(key)
    ) {
      if (event.keyCode == 37 && key == '%') return false
      else return true
    }
    return false
  })
}

function arabicLettersOnly(e) {
  // const regTest = /^[ا-يأؤءإآلالإ]+[ا-يأءئؤلإآلإلاىًٌٍَُِّْ\s]*$/g;
  const engilshAndSpecialReg = /[~`!@#$%^&*()_+=[\]\{}|;':",.\/<>?a-zA-Z0-9-]/g
  e.target.value = e.target.value.trimStart().replace(engilshAndSpecialReg, '')

  // if (!regTest.test(e.target.value)) {
  //     console.log("en");
  //     // e.target.value = "";
  //     return false;
  // } else {
  //     e.target.dataset.value = e.target.value;
  //     console.log("ar");
  // }
}

function saudiMobileNumber(e) {
  const regTest = /^(05)[0-9]{8}$/g
  if (!regTest.test(e.target.value)) {
    e.target.value = ''
    return false
  }
}

$('.arabic-letters-only').on('input', arabicLettersOnly)
$('.saudi-mobile-number').on('blur', saudiMobileNumber)

function init_fields_validations() {
  applyOnlyNumberCustom()

  $('.only-number')
    .attr('inputmode', 'numeric')
    .attr('pattern', '[0-9]*')
    .attr('lang', 'en')
  $('.only-number').filter_input({
    regex: /^([\u0660-\u0669]|[0-9])*$/,
    selector: '.only-number',
  })
  $('.only-number').on('input', parseHindiNumber)
  $('.only-number[maxLength]').keypress(function (e) {
    if (!e.target) return false

    if (e.target.selectionEnd - e.target.selectionStart > 0) return true
    var value = e.target.value
    var length = e.target.maxLength
    if (value.length < length) return true
    return false
  })

  $('.english-only').on('keypress', function (event) {
    var englishAlphabetAndWhiteSpace = /^[ a-zA-Z]+( [ a-zA-Z]+)*$/g
    var key = String.fromCharCode(event.which)
    if (
      event.keyCode == 8 ||
      event.keyCode == 37 ||
      event.keyCode == 39 ||
      englishAlphabetAndWhiteSpace.test(key)
    ) {
      if (event.keyCode == 37 && key == '%') return false
      else return true
    }
    return false
  })

  $('.only-currency').on('keypress', function (e) {
    let keyCode = e.keyCode ? e.keyCode : e.which
    if (
      ((keyCode < 48 || keyCode > 57) && keyCode !== 46) ||
      (keyCode === 46 && $(this).val().includes('.'))
    ) {
      // 46 is dot
      e.preventDefault()
    }
  })

  $('.only-currency').on('input', convetNumberToCurrency)
}

//set flag to manage change donation type
let donationType
// Fixed side menu listener
const cardsContainer = document.getElementById('cards')
const cardsDropdown = document.getElementById('cards-dropdown')
const getCard = (initiativeType) => {
  cardsDropdown.innerHTML = '<option value="0">بطاقة أخرى</option>'
  $.ajax({
    type: 'GET',
    url: `/UserCardsByInitiativeType?InitiativeType=${initiativeType}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    success: function (response) {
      const cards = response.cards
      if (cards) {
        cardsContainer.classList.remove('d-none')
        cards.forEach((card) => {
          cardsDropdown.innerHTML += `<option value="${card.id}">${card.maskedCardNo}</option>`
        })
      } else {
        cardsContainer.classList.add('d-none')
      }
    },
    failure: function () {
      cardsContainer.classList.add('d-none')
    },
    error: function () {
      cardsContainer.classList.add('d-none')
    },
  })
}
function handleFixedSideNavTabClick(
  event,
  element,
  initiativeType,
  initiativeTypeNumber
) {
  $('#qd_initiativeType').val(initiativeType)
  donationType = initiativeType
  if (cardsDropdown) {
    getCard(initiativeTypeNumber)
  }
  var thisElement = $('.fixed-side-menu .nav-tabs li.active')

  console.log(thisElement, event.target)

  document
    .querySelector('.fixed-side-menu .nav-tabs li.active')
    .classList.remove('active')
  element.classList.add('active')

  //For accessabilty
  //window.qdAccess.switchChildren(thisElement, $(element));

  //document.getElementById(menuId).classList.add("active", "in");
  if (donationType === 'publicOpportunity') {
    $('form[name="paymentDetailsFormQuickMenu"]').attr('aria-label', 'تبرع عام')
    $('div.amount-field button.btn-primary-blue').attr(
      'aria-label',
      'تبرع الآن'
    )
    $('#creditCardFromDetailsQuickMenu button.btn-gradient').attr(
      'aria-label',
      'إتمام عملية التبرع العام'
    )
    /*$('#divSaveCard').toggleClass('d-flex');*/
    $('#divSaveCard').show()
  } else if (donationType === 'forijatQuickDonation') {
    $('form[name="paymentDetailsFormQuickMenu"]').attr(
      'aria-label',
      'التبرع لِفُرِجَت'
    )
    $('div.amount-field button.btn-primary-blue').attr(
      'aria-label',
      'تبرع الآن لِفُرِجَت'
    )
    $('#creditCardFromDetailsQuickMenu button.btn-gradient').attr(
      'aria-label',
      'إتمام عملية التبرع لِفُرِجَت'
    )
    /* $('#divSaveCard').toggleClass('d-flex');*/
    $('#divSaveCard').hide()
  } else if (donationType === 'tanfeethQuickDonation') {
    $('form[name="paymentDetailsFormQuickMenu"]').attr(
      'aria-label',
      'التبرع لِتيسرت'
    )
    $('div.amount-field button.btn-primary-blue').attr(
      'aria-label',
      'تبرع الآن لِتيسرت'
    )
    $('#creditCardFromDetailsQuickMenu button.btn-gradient').attr(
      'aria-label',
      'إتمام عملية التبرع لِتيسرت'
    )
    /*$('#divSaveCard').toggleClass('d-flex');*/
    $('#divSaveCard').hide()
  } else if (donationType === 'AwkaafQuickDonation') {
    $('form[name="paymentDetailsFormQuickMenu"]').attr(
      'aria-label',
      'التبرع لوقف'
    )
    $('div.amount-field button.btn-primary-blue').attr(
      'aria-label',
      'تبرع الآن لوقف'
    )
    $('#creditCardFromDetailsQuickMenu button.btn-gradient').attr(
      'aria-label',
      'إتمام عملية التبرع لوقف'
    )
    /*$('#divSaveCard').toggleClass('d-flex');*/
    $('#divSaveCard').hide()
  }
  event.stopPropagation()
}

function buildModal(theID, theTITLE, theREL, button) {
  var noButtonText = button === '' ? 'نعم' : 'لا'
  var result =
    '<div id="modal_confirm_' +
    theID +
    '" class="modal modal-confirm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" hideCloseButton="true">'
  result +=
    '<a class="btn custom-close" rel="modal:close"><span aria-hidden="true">&times;</span></a>'
  result += '<div class="modal-dialog modal-sm">'
  result += '<div class="modal-content px-3 px-sm-5">'
  result += '<div class="modal-header text-primary-green">'
  result += '<h4 class="modal-title" id="myModalLabel">' + theTITLE + '</h4>'
  result += '</div>'
  result += '<div class="modal-body">' + theREL + '</div>'
  result += '<div class="modal-footer text-right">'
  result +=
    '<button type="button" id="cancelButton_' +
    theID +
    '" class="btn btn-default" data-dismiss="modal">' +
    noButtonText +
    '</button>'
  result += button
  result += '</div></div></div></div>'
  return result
}

function closeModal() {
  $.modal.close()
}

function ConfirmDialog(
  theTITLE,
  theMessage,
  callBackFunction,
  noCallBackFunction
) {
  var random_id = Math.floor(Math.random() * 1000000 + 1)
  var okButton = $(
    '<button id="okButton_' +
      random_id +
      '" class="btn btn-dark-green okButton">نعم</button>'
  )

  var theTARGET = buildModal(
    random_id,
    theTITLE,
    theMessage,
    okButton[0].outerHTML
  )

  $(theTARGET).modal({ backdrop: 'static', show: true, modalClass: '' })
  $(document).on('click', '#okButton_' + random_id, function () {
    closeModal()
    if (typeof callBackFunction === 'function') callBackFunction()
  })
  $(document).on('click', '#cancelButton_' + random_id, function () {
    closeModal()
    if (typeof noCallBackFunction === 'function') noCallBackFunction()
  })
}

/* ---------------Currency Input Format ----------------- */

function FixedDecimal(value) {
  return Number.parseFloat(value).toFixed(2)
}

function getCaretPosition(elem) {
  // Initialize
  var ipos = 0

  // IE Support
  if (document.selection) {
    // Set focus on the element
    elem.focus()

    // To get cursor position, get empty selection range
    var oSel = document.selection.createRange()

    // Move selection start to 0 position
    oSel.moveStart('character', -elem.value.length)

    // The caret position is selection length
    ipos = oSel.text.length
  }

  // Firefox support
  else if (elem.selectionStart || elem.selectionStart == '0')
    ipos = elem.selectionStart

  // Return results
  return ipos
}

function setCaretPosition(elem, pos) {
  if (elem !== null) {
    if (elem.createTextRange) {
      var range = elem.createTextRange()
      range.move('character', pos)
      range.select()
    } else {
      if (elem.selectionStart) {
        elem.focus()
        elem.setSelectionRange(pos, pos)
      } else elem.focus()
    }
  }
}

function getSpecialCharsOnSides(x, cursorPosition) {
  var specialCharsLeft = x
    .substring(0, cursorPosition)
    .replace(/[0-9]/g, '').length
  var specialCharsRight = x
    .substring(cursorPosition)
    .replace(/[0-9]/g, '').length
  return [specialCharsLeft, specialCharsRight]
}

function formatNumber(x) {
  return getNumberFormat().format(x)
}

function removeThousandSeparators(x) {
  return x
    .toString()
    .replace(new RegExp(escapeRegExp(getThousandSeparator()), 'g'), '')
}

function getThousandSeparator() {
  return getNumberFormat().format('1000').replace(/[0-9]/g, '')[0]
}

function getCommaSeparator() {
  return getNumberFormat().format('0.01').replace(/[0-9]/g, '')[0]
}

function getNumberFormat() {
  return new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 })
}

function htmlEnc(s) {
  return s
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&#34;')
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

function removeCurrencyformat(currency) {
  try {
    if (currency == '' || currency == undefined || currency == '.') return 0
    return currency.toString().replace(/,/g, '')
  } catch (e) {
    return 0
  }
}
/* -------------End Currency Input Format ----------------- */

function ShowMessage(
  elementId,
  title,
  message,
  type = AlertType.Sucess,
  autoclose = true,
  showClose = false
) {
  var alertHtml = ''
  var alertDiv = document.createElement('div')

  alertDiv.className = 'border-rounded-15 alert alert-' + type
  alertDiv.setAttribute('role', 'alert')
  alertDiv.setAttribute('style', 'display: none')

  if (title !== '' && title !== null && title !== undefined)
    alertHtml = '<strong>' + title + '</strong> : '

  alertHtml += message

  if (showClose || !autoclose)
    alertHtml +=
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'

  alertDiv.innerHTML = alertHtml.trim()

  $('#' + elementId).prepend(alertDiv)

  if (autoclose)
    $(alertDiv)
      .fadeIn()
      .delay(4000)
      .queue(function () {
        $(this).remove()
      })
  else $(alertDiv).fadeIn()
}

function ShowMessageMaxLength(
  parentId,
  message,
  type,
  autoclose = true,
  showClose = false
) {
  var alertHtml =
    '<div id="' +
    parentId +
    '_alert" class="alert alert-' +
    type +
    ' border-rounded-15" role="alert" style="display: none">' +
    ' ' +
    message

  if (showClose || !autoclose)
    alertHtml +=
      '<button type = "button" class="close" data - dismiss="alert" aria - label="Close"><span aria - hidden="true" >& times;</span></button>'

  $('#' + parentId).prepend(alertHtml)

  if (autoclose)
    $('#' + parentId + '_alert')
      .fadeIn()
      .delay(4000)
      .slideUp()
}
//alert(document.readyState);
window.addEventListener('load', (event) => {
  $('#srNotificationArea').attr('aria-live', 'polite').html('تم تحميل الصفحة')
})

jQuery(function () {
  $('.click-select').focus(function () {
    $('.click-select').select()
  })
  var Ihsan = function () {
    this.events()
  }

  Ihsan.prototype.events = function () {
    $(document).on('click', '.droopmenu', this.toggleMenu)
    //$(document).on('click', '.droopmenu .droopmenu-indicator', this.toggleMenu);
  }

  Ihsan.prototype.toggleMenu = function (event) {
    if (event.target.nodeName === 'A') {
      var href = $(event.target)
      if (href.attr('href') === '#') {
        //alert(href.parent().hasClass("dmtoggle-open"))
        if (!href.parent().hasClass('dmtoggle-open')) {
          href.parent().addClass('dmtoggle-open')
          href.parent().find('ul').show()
        } else {
          href.parent().removeClass('dmtoggle-open')
          href.parent().find('ul').hide()
        }
      }
    }
  }

  $.fn.IHSAN = function () {
    return new Ihsan()
  }

  $(document).IHSAN()
}, jQuery)

const AlertType = {
  Sucess: 'success',
  Faild: 'danger',
}

//Prevent any input text required to take space in first
$('input[data-space="false"]').on('keyup', function (e) {
  let firstChar = $(this).val()[0]
  if (firstChar === ' ') {
    $(this).val('')
    $(this).addClass('error')
  }
})
