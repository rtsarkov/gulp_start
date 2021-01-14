var vw = window.innerWidth;
var vh = window.innerHeight;
var sw = screen.width;
var sh = screen.height;
var pageScroll = window.pageYOffset || document.documentElement.scrollTop;

jQuery(document).ready(function ($) {

    /* PARAMS */

    $(window).resize(function () {
        vw = window.innerWidth;
        vh = window.innerHeight;
        sw = screen.width;
        sh = screen.height;
    });

    $(document).scroll(function () {
        pageScroll = window.pageYOffset || document.documentElement.scrollTop;
    });

    initInput();

    /* ACTIONS */

    // плавный скрол до элемента и отключение действий для ссылок "#"
    $('[href^="#"]').click(function (e) {
        e.preventDefault();
        if ($(this).attr('href').length > 1) {
            scroll2element(
                $($(this).attr('href')),
                1000,
                0,
                false
            );
        }
    });

    // placeholders
    (function () {
        var placeholder = '';
        $(document).on('focusin', 'input, textarea', function () {
            placeholder = $(this).attr('placeholder');
            $(this).attr('placeholder', '');
        });
        $(document).on('focusout', 'input, textarea', function () {
            $(this).attr('placeholder', placeholder);
        });
    })();

    // ajax forms
    $(document).on('submit', '[data-form-ajax]', function (e) {
        e.preventDefault();
        sendForm($(this));
    });

    // всплывающие формы
    $('[data-popup-form]').click(function (e) {
        e.preventDefault();
        var form = $(this).data('popup-form');

        $.colorbox({
            href: '/ajax/form/' + form + '-form.html',
            className: 'colorbox-form',
            maxWidth: '100%',
            maxHeight: '100%',
            opacity: false,
        });
    });

    // colorbox
    $('.colorbox').colorbox({
        maxWidth: '100%',
        maxHeight: '100%',
        opacity: false
    });

    // colorbox buttons svg
    (function () {
        $(document).bind('cbox_complete', function () {
            initInput();
            $("#cboxPrevious").html('<svg class="icon icon-arrow"><use xlink:href="#icon-arrow"></svg>');
            $("#cboxNext").html('<svg class="icon icon-arrow"><use xlink:href="#icon-arrow"></svg>');
        });

        $(document).bind('cbox_load', function () {
            $("#cboxClose").html('<svg class="icon icon-close"><use xlink:href="#icon-close"></svg>');
        });
    })();

    // slick
    $('.slider').slick({
        arrows: true,
        prevArrow: '<i class="slider__arrow slider__arrow--prev"><svg class="icon icon-arrow"><use xlink:href="#icon-arrow"></svg></i>',
        nextArrow: '<i class="slider__arrow slider__arrow--next"><svg class="icon icon-arrow"><use xlink:href="#icon-arrow"></svg></i>',

        dots: true,
        dotsClass: 'slider__dots',
        customPaging: function (slider, i) {
            return '';
        },

        autoplay: false,
        autoplaySpeed: 3000,

        infinite: false,
        adaptiveHeight: true,

        slidesToShow: 1,
        slidesToScroll: 1,

        mobileFirst: true,
        responsive: [{
            breakpoint: 1219,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        }]
    });
});