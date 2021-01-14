function sendForm($el) {
    var $form = $el,
        $btn = $form.find('button'),
        fd = new FormData($form[0]);

    if ($btn.hasClass('is-loading')) return;

    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: fd,
        processData: false,
        contentType: false,
        dataType: 'json',
        // dataType: 'html',
        beforeSend: function () {
            hideErrorFields($form);
            showBtnLoading($btn);
        },
        success: function (data) {
            // console.log('form success', data);
            setTimeout(function () {
                hideBtnLoading($btn);
                initInput();

                if (data.result) {
                    $form[0].reset();
                    if (data.messages.length) {
                        showPopupMessage(data.messages);
                    }
                } else {
                    if (data.messages.length) {
                        showPopupMessage(data.messages);
                    }
                    showErrorFields($form, data.errors);
                }
            }, 1000);
        },
        error: function (data) {
            // console.log('form error:', data);
            setTimeout(function () {
                hideErrorFields($form);
                hideBtnLoading($btn);
            }, 1000);
        }
    });

    function showErrorFields($form, errors) {
        $.each(errors, function (i, val) {
            $el = $form.find("[name='" + val + "']");
            if ($el.length) $el.addClass('is-error');
        });
    }
    function hideErrorFields($form) {
        $form.find('.is-error').removeClass('is-error');
    }

    function showBtnLoading($btn) {
        $btn.addClass('is-loading');
    }
    function hideBtnLoading($btn) {
        $btn.removeClass('is-loading');
    }
}

function showPopupMessage(text) {
    $.colorbox({
        html: '<div class="popup-message">' + text + '</div>',
        maxWidth: '100%',
        maxHeight: '100%',
        opacity: false,
        className: 'colorbox-message'
    });
}

function initInput() {
    if ($().datepicker) {
        $('input.date').datepicker({
            autoClose: true,
            toggleSelected: false,
            keyboardNav: false,
            minDate: new Date()
        });
    }
    if ($().inputmask) {
        $('[data-mask="phone"]').inputmask("+7-999-999-99-99");
    }
    if ($().styler) {
        setTimeout(function () {
            $(":not(.nostyle)").styler({
                singleSelectzIndex: 10,
                filePlaceholder: 'Файл не выбран',
                fileBrowse: 'Выбрать',
                fileNumber: 'Выбрано файлов: %s',
                onFormStyled: function () {
                    $('.jq-selectbox__trigger-arrow').html('<svg class="icon icon-arrow"><use xlink:href="#icon-arrow"></svg>');
                    $('.jq-checkbox__div').html('<svg class="icon icon-checkbox"><use xlink:href="#icon-checkbox"></svg>');
                }
            });
        }, 100);
    }
}

function scroll2element($el, speed, offset, edges) {
    if (speed == undefined) speed = 'slow';
    if (offset == undefined) offset = 50;
    if (edges == undefined) edges = true;

    var scroll = $el.offset().top - offset,
        topEdge = window.pageYOffset,
        bottomEdge = window.pageYOffset + document.documentElement.clientHeight,
        bNeedScroll = edges ? (scroll < topEdge || scroll > bottomEdge) : true;

    if (bNeedScroll) {
        $('html, body').animate({
            scrollTop: scroll + 'px'
        }, speed);
    }
}