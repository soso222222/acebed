// common script
'use strict';
$(document).ready(function () {
  preventDefaultAnchor();
  initEvent();
});

function preventDefaultAnchor() {
  $(document).on('click', 'a[href="#"]', function (e) {
    e.preventDefault();
  });
}

function setHeaderMouseEvents(status, className) {

  if (status == 'enter') {
    $('body.sub #gnb > ul.etc > li.menu img').attr('src', '../img/header-menu-btn.png');

    if (className == 'bed-product') {
      $('#header').addClass('open bed-product');
      $('#gnb > ul.bed-product > li > ul').css({ 'display': 'block' });
      $('#gnb > ul.about-ace > li > ul').css({ 'display': 'none' });
    } else if (className == 'about-ace') {
      $('#header').addClass('open about-ace');
      $('#gnb > ul.about-ace > li > ul').css({ 'display': 'block' });
      $('#gnb > ul.bed-product > li > ul').css({ 'display': 'none' });
    }

  } else if (status == 'leave') {
    $('body.sub #gnb > ul.etc > li.menu img').attr('src', '../img/header-menu-btn-wht.png');

    if (className == 'bed-product') {
      $('#header').removeClass('open bed-product');
      $('#gnb > ul.bed-product > li > ul').css({ 'display': 'none' });
    } else if (className == 'about-ace') {
      $('#header').removeClass('open about-ace');
      $('#gnb > ul.about-ace > li > ul').css({ 'display': 'none' });
    }
  }
}

// main-menu mouse hover 처리
function initEvent() {
  $('#gnb > ul.bed-product').on('mouseenter focusin', function () {
    setHeaderMouseEvents('enter', 'bed-product');
  }).on('mouseleave', function () {
    setHeaderMouseEvents('leave', 'bed-product');
  });
  $('#gnb > ul.about-ace').on('mouseenter focusin', function () {
    setHeaderMouseEvents('enter', 'about-ace');
  }).on('mouseleave', function () {
    setHeaderMouseEvents('leave', 'about-ace');
  });
  $('#header').on('focusout', function () {
    // setHeaderMouseEvents('leave', 'bed-product');
    // setHeaderMouseEvents('enter', 'about-ace');
  });
  $('#gnb > ul.bed-product > li').on('mouseenter', function () {
    $(this).addClass('on');
  }).on('mouseleave', function () {
    $(this).removeClass('on');
  });
  $('#gnb > ul.about-ace > li').on('mouseenter', function () {
    $(this).addClass('on');
  }).on('mouseleave', function () {
    $(this).removeClass('on');
  });
  $('#gnb > ul.etc > li > a').on('click', function () {
    $(this).parent().toggleClass('on');
   });
  $('#gnb div.search-box p.close > a').on('click', function () {
    $('#gnb > ul.etc > li.search').removeClass('on');
  });
  $('#footer div.quick-link > ul.menu > li:last-child > a').on('click', function () {
    $('#footer div.quick-link').toggleClass('on');
  });
  $('#footer div.quick-link > ul.content div.quick-menu-list > p.close a').on('click', function () {
    $('#footer div.quick-link').toggleClass('on');
  });
  $('#footer .family-site-link > div.arrow > a').on('click', function () {
    $('.family-site-link').toggleClass('close');
  });
  
  $('#sub-product-list div.top > ul.arr-list > li.view > ul > li.row-3 a').on('click', function () {
    showRowView('row-3');
  });
  $('#sub-product-list div.top > ul.arr-list > li.view > ul > li.row-2 a').on('click', function () {
    showRowView('row-2');
  });
  $('#sub-product-list .category-matt > ul > li > a').on('click', function () {
    var mattLi = $(this).parent();
    if(mattLi.hasClass('on')){
      mattLi.find('ul').css({'height': '0'});
      mattLi.removeClass('on');
    } else {
      $('#sub-product-list .category-matt > ul > li').removeClass('on');
      mattLi.addClass('on');
      
      if(mattLi.find('ul').length > 0) {
        var height = 0;
        $(this).next().find(' > li').each(function() {
          height += $(this).outerHeight(true);
          // $(this).removeClass('on');
        });
        $(this).next().css({'height': height + 'px'});
        $(this).parent().siblings().each(function() {
          $(this).find('ul').css({'height': '0'});
        });
      }
    }
     
  });


}

function showRowView(row) {
  $('#sub-product-list div.top > ul.arr-list > li.view > ul > li').removeClass('on');
  $('#sub-product-list div.list').removeClass('row-3 row-2');
  if (row == 'row-3') {
    $('#sub-product-list div.top > ul.arr-list > li.view > ul > li.row-3').addClass('on');
    $('#sub-product-list div.list').addClass(row);
  } else if (row == 'row-2') {
    $('#sub-product-list div.top > ul.arr-list > li.view > ul > li.row-2').addClass('on');
    $('#sub-product-list div.list').addClass(row);
  }
}







