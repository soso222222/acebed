// common script
'use strict';
$(document).ready(function () {
  preventDefaultAnchor();
  initEvent();
  initModule();
});

function preventDefaultAnchor() {
  $(document).on('click', 'a[href="#"]', function (e) {
    e.preventDefault();
  });
}


function getScrollTop() {
  return $(document).scrollTop();
  // if(window.pageYOffset !== undefined)
  // {
  //     return window.pageYOffset;
  // } else {
  //     return document.documentElement.scrollTop;
  //     // || document.body.scrollTop;
  // }
}
function checkHeaderScroll() {
  var scrollAmt = getScrollTop();
  var headerHeight = Number($('#header').outerHeight()) + 10;
  
  if (scrollAmt > headerHeight) {
    $('#header').addClass('scroll');
  }else if (scrollAmt <= headerHeight) {
    $('#header').removeClass('scroll');
  }
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
  $(window).on('scroll', function () {
    checkHeaderScroll();
  });
  $(window).on('resize', function() {
    setLogo();
  });
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

  // sub menu event
  $('section.system ul.list > li').on('mouseenter', function () {
    $(this).siblings('li').removeClass('on');
    $(this).addClass('on');
  });
  
  $('#sub-product-list .category-matt > ul > li > a').on('click', function () {
    var mattLi = $(this).parent();
    var mattUl = mattLi.find('ul');

    if(mattLi.hasClass('on')){
      mattUl.css({'height': '0'});
      mattLi.removeClass('on');
    } else {
      $('#sub-product-list .category-matt > ul > li').removeClass('on');
      mattLi.addClass('on');
      
      if(mattUl.length > 0) {
        var height = 0;
        $(this).next().find(' > li').each(function() {
          height += $(this).outerHeight(true);
          // $(this).removeClass('on');
        });

        //일정 높이 이상이면 스크롤이 생기도록
        if (height > 275) {
          height = 275;
          mattLi.children('ul').css({'overflow-y':'scroll'});
        }
        $(this).next().css({'height': height + 'px'});
        $(this).parent().siblings().each(function() {
          $(this).find('ul').css({'height': '0'});
        });
      }
    }
     
  });

  $(".category-matt input[type='checkbox']").change(function () {
    var categoryId = $(this).attr('id');
    var categoryType = '';
    var keyword = '';

    // if ($(this).is(":checked")) {
    if ($(this).prop("checked")) {
      categoryType = $(this).attr('name');
      keyword = $(this).attr('value');
      
      $(this).parent().addClass('on');
      addTag(categoryId, $(this).siblings('label').text());

    } else {
      //del tag
      if ($('#sub-product-list .filter > ul.keyword:eq(0) > li').length > 1) {
        categoryType = $(this).attr('name');
        keyword = $(this).attr('value');
        delTag('', categoryId);
      } else {
        $(this).parent().removeClass('on');
        delTag('all');
      }
      //
    }
    showList(type);
  });
  //event 위임
  $('#sub-product-list div.filter > ul.keyword').on('click', 'a.del', function (e) {
    var categoryId = $(this).parent().attr('data-category');

    if ($('#sub-product-list .filter > ul.keyword:eq(0) > li').length > 1) {
      // $('#sub-product-list div.side ul > li > ul > li > input:checked').each(function (i) {
      $(".category-matt input[type='checkbox']:checked").each(function (i) {
        if (categoryId == $(this).attr('id')) {
          delTag('', categoryId);
          $(this).prop('checked', false);
          $(this).parent().removeClass('on');
          return false;
        }
      });
    } else {
      $(this).parent().removeClass('on');
      $(".category-matt input[type='checkbox']").prop('checked', false);
      delTag('all');
    }
    showList(type);
  });
  $('#sub-product-list div.top > div.filter span.clear').on('click', function() {
    $(".category-matt input[type='checkbox']").prop('checked', false);
    $('#sub-product-list div.side ul > li > ul > li').removeClass('on');
    delTag('all');
    showList(type);
  });
  $('#sub-product-list div.pages p.number').on('click', 'a.page', function() {
    var index = $(this).index();
    showList(type, (index + 1));
  });
  $('#sub-product-list div.pages p.number').on('click', 'a.prev', function() {
    var index = 0;
    $(this).siblings().each(function (i) {
      if($(this).hasClass('on')) index = parseInt($(this).attr('data-page'));
      return;
    });
    index = (index - maxPage) <= 1 ? index = 1 : (index - maxPage);
    // alert(index);
    showList(type, index);
  });
  $('#sub-product-list div.pages p.number').on('click', 'a.next', function() {
    var index = 0;
    $(this).siblings().each(function (i) {
      if($(this).hasClass('on')) index = parseInt($(this).attr('data-page'));
      return;
    });
    index = (index + maxPage) > totalPage ? index = totalPage - (totalPage % maxPage) + 1 : (index + maxPage);
    // alert(index);
    showList(type, index);
  });
  $('#sub-product-list div.pages p.number').on('click', 'a.first', function() {
    showList(type, 1);
  });
  $('#sub-product-list div.pages p.number').on('click', 'a.last', function() {
    showList(type, totalPage);
  });
  $('#sub-product-list div.list-box ul.list').on('click', 'ul.info > a.like', function() {
    var likeTimer = '';
    
    var curLi = $(this).closest('ul.content').parent();
    if(curLi.hasClass('liked')) {
      curLi.addClass('show-unlike');
      curLi.removeClass('liked');
      curLi.addClass('unliked');
      likeTimer = setTimeout(function() {curLi.removeClass('show-unlike');}, 2000);
      $(this).find(".img-like").attr('src', '../img/icon-like.png');
    }else {
      curLi.addClass('show-like');
      curLi.removeClass('unliked');
      curLi.addClass('liked');
      likeTimer = setTimeout(function() {curLi.removeClass('show-like');}, 2000);
      $(this).find(".img-like").attr('src', '../img/icon-liked.png');
    }
  });
  $('#sub-product-list div.list-box ul.list').on('mouseenter focusin', 'p.palette > a', function () {
    var index = $(this).index();
    $(this).closest('li').find('div.color-info:eq(' + index + ')').addClass('on');
  }).on('mouseleave focusout', 'p.palette > a', function () {
    $(this).closest('li').find('div.color-info').removeClass('on');
  });

}

function showRowView(row) {
  $('#sub-product-list ul.list > li').removeClass('on'); // transition 초기화
  $('#sub-product-list div.list-box').removeClass('row-3 row-2 row-1'); // list-view 초기화
  $('ul.arr-list > li.view > ul > li').removeClass('on'); // tab 초기화
  $('#sub-product-list div.top > ul.arr-list > li.view > ul > li.' + row).addClass('on');
  $('#sub-product-list div.list-box').addClass(row);
  
  $('#sub-product-list div.list-box ul.list > li').each(function(i) {
    var listupTimer = setTimeout(function() { $('#sub-product-list ul.list > li:eq(' + i + ')').addClass('on'); }, (i + 1) * 100);
  });
}
function showRowViewM(row) {
  $('#sub-product-list ul.list > li').removeClass('on'); // transition 초기화
  $('#sub-product-list div.list-box').removeClass('row-3 row-2 row-1'); // list-view 초기화
  $('ul.arr-list li').removeClass('on'); // mobile tab 초기화
  $('#sub-product-list div.top-m ul.arr-list > li.' + row).addClass('on');
  $('#sub-product-list div.list-box').addClass(row);
  
  $('#sub-product-list div.list-box ul.list > li').each(function(i) {
    var listupTimer = setTimeout(function() { $('#sub-product-list ul.list > li:eq(' + i + ')').addClass('on'); }, (i + 1) * 100);
  });
}

function loadList(url, key) {
  $.ajax({
    url: url,
    dataType: 'json',

    success: function (loadData) {
      bedInfoData = loadData[key];

      if (bedInfoData.length > 0) {
        showList(type);
      }
    },
    error : function() {
      console.log('data load error');			
    }
  });
}
function setPage(list, curPage) {
  var maxList = 12;
  maxPage = 10;
  totalPage = Math.floor((list.length / maxList) + 1);
  var curPage = (curPage === undefined) ? 1 : curPage;
  var startPage = (curPage % 10 === 0) ? (curPage - maxPage) + 1 : curPage - (curPage % maxPage) + 1; // 11
  var endPage = startPage + maxPage - 1; //20
  var isPrev = false;
  var isNext = false;
  // var startList = ((curPage - 1) * maxList) + 1;
  // var endList = (maxList * curPage);
  // remainderPage

  $('#sub-product-list div.pages p.number').find('a').remove();
  
  if (endPage > totalPage) {
    endPage = totalPage;
  }
  
  // >>
  // <<
  if ((startPage + maxPage) <= totalPage) isNext = true
  if ((endPage - maxPage) >= 1) isPrev = true;

  if (isPrev) {
    $('#sub-product-list div.pages p.number').append('<a href="#" class="first"></a>');
    $('#sub-product-list div.pages p.number').append('<a href="#" class="prev"></a>');
  }
  for (var i = startPage; i < (endPage + 1); i++) {
    if (i === curPage) {
      $('#sub-product-list div.pages p.number').append('<a href="#" data-page="' + i + '" class="page on">' + i + '</a>');
    } else {
      $('#sub-product-list div.pages p.number').append('<a href="#" data-page="' + i + '" class="page">' + i + '</a>');
    }
  }
  if (isNext) {
    $('#sub-product-list div.pages p.number').append('<a href="#" class="next"></a>');
    $('#sub-product-list div.pages p.number').append('<a href="#" class="last"></a>');
  }
}
function showList(type, page) {
  var resultArr = bedInfoData;
  var categoryType = '';
  var categoryValue = '';
  var maxList = 12;
  var listType = (type === undefined) ? null : type;
  var curPage = (page === undefined) ? 1 : page;
  var startList = ((curPage - 1) * maxList) + 1;
  var endList = (maxList * curPage);

  $('#sub-product-list ul.list > li').removeClass('on');
  $('#sub-product-list div.list-box ul.list').find('li').remove();
  
  $(".category-matt input[type='checkbox']:checked").each(function (index) {
    categoryType = $(this).attr('name');
    categoryValue = $(this).attr('value');
    
    resultArr = resultArr.filter(function (el, i) {
      var data = el[categoryType].toLowerCase().split('|');
      return data.indexOf(categoryValue) > -1;
    });
  });

  if (endList > resultArr.length) {
    endList = resultArr.length;
  }

  for(var i = (startList - 1); i < endList; i++) {
    var item = resultArr[i];
    var categoryName = item['name'];
    var categorySize = item['category-size'].replaceAll('|', ' / ');
    var imgSrc = item['img-src'];
    var contentText = '';
    var appendStr = '';

    // `<li data-size="` + item['category-size'] + `" data-rank="` + item['category-rank'] + `" data-cushion="` + item['category-cushion'] + `" data-spring="` + item['category-spring'] + `" data-store="` + item['category-store'] + `">
    if(listType === 'bedMattressInfo'){
      var categoryRank = item['category-rank'].replaceAll('-', ' ');
      appendStr = 
      `<li>
        <p class="category-rank">` + categoryRank + `</p>
      </li>`;

    } else if(listType === 'bedFrameInfo') {
      var type = item['type'];
      var colorInfo = item['color'];
      var linkColor = '';
      var spanColor = '';
      var divColorInfo = ''
      var leftPosition = 6;

      $.each(colorInfo, function (i) {
        var colorName = colorInfo[i]['name'].split('|');
        var colorHex = colorInfo[i]['hex'].split('|');
        spanColor = '';
        linkColor = '';

        
        $.each(colorHex, function (j) {
          if (colorHex[j].indexOf(',') > -1) {
            var colorsDetail = colorHex[j].split(',');
            // if (Array.isArray(colorHex) === true) {}
            $.each(colorsDetail, function (z) {
              spanColor += '<span class="color-2" style="background-color: ' + colorsDetail[z] + ';"></span>';
            });
          } else {
            spanColor = '<span class="color" style="background-color: ' + colorHex[j] + ';"></span>';
          }
          linkColor += '<a href="#">' + spanColor + '</span></a>';
          divColorInfo += `
          <div class="color-info" style="left: ` + (j * leftPosition) + `%;">
            <div class="color-box">
              ` + spanColor + `
            </div>
            <span class="colorName">` + colorName[j ] + `</span>
          </div>`;
        });
        
      });

      appendStr = `
      <li>
        <p class="category-type">` + type + `</p>
      </li>
      <li>
        <p class="palette">` + linkColor + `</p>
        ` + divColorInfo + `
      </li>
      `;

    }
    contentText = 
    `<li>
        <ul class="content">
          <li>
            <a href="#">
              <img alt="" src="` + imgSrc + `" class="photo" />
              <div class="like-area">
                <div class="like-alert"><p><em>관심 제품으로<br />찜하였습니다.</em><br />마이페이지, 퀵 메뉴에서<br />확인하실 수 있습니다.</p></div>
                <div class="unlike-alert"><p>관심 제품에서<br /> 제외합니다.</p></div>
              </div>
              </a>
          </li>
          <li>
            <ul class="info">
              <li>
                <p class="category-size">` + categorySize + `</p>
              </li>
              <li>
                <p class="title">` + categoryName + `</p>
              </li>
              ` + appendStr + `
              <a href="#" class="like"><img alt="찜하기" src="../img/icon-like.png" class="img-like" /></a>
            </ul>
          </li>
        </ul>
    </li>`;

    $('#sub-product-list div.list-box ul.list').append(contentText);
  }
  setPage(resultArr, curPage);
  $('#sub-product-list .top > p.total-product > strong.num').text(resultArr.length + '개');

  $('#sub-product-list div.list-box ul.list > li').each(function(i) {
    var listupTimer = setTimeout(function() { $('#sub-product-list ul.list > li:eq(' + i + ')').addClass('on'); }, (i + 1) * 100);
  });

  // var listupTimer = setTimeout(function() { $('#sub-product-list ul.list').addClass('on'); }, 200);
    
  // $('#sub-product-list ul.list').addClass('on');
}



function setRowView() {
  var windowWidth = $(window).width();
  if (windowWidth < 1000){
    showRowViewM('row-2');
  }else{
    showRowView('row-3');
  }
  $('#sub-product-list div.top > ul.arr-list > li.view > ul > li.row-3 a').on('click', function () {
    showRowView('row-3');
  });
  $('#sub-product-list div.top > ul.arr-list > li.view > ul > li.row-2 a').on('click', function () {
    showRowView('row-2');
  });
  $('#sub-product-list div.top-m ul.arr-list > li.row-2 a').on('click', function () {
    showRowViewM('row-1');
  });
  $('#sub-product-list div.top-m ul.arr-list > li.row-1 a').on('click', function () {
    showRowViewM('row-2');
  });
}

function setLogo() {
  var windowHeight = $(window).width();
  var size = windowHeight < 768 ? 'm' : 'pc';
  var color = $('body').hasClass('bed') ? 'white' : 'black';

  switch (color) {
    case 'white':
      $('#header h1 a img.black').css({'display': 'none'});
      $('#header h1 a img.white').css({'display': 'block'});

      if(size === 'm') {
        $('#mobile-menu img.black').css({'display': 'none'});
        $('#mobile-menu img.white').css({'display': 'block'});
      }
      break;
    default:
      $('#header h1 a img.black').css({'display': 'block'});
      $('#header h1 a img.white').css({'display': 'none'});

      if(size === 'm') {
        $('#mobile-menu img.black').css({'display': 'block'});
        $('#mobile-menu img.white').css({'display': 'none'});
      }
      break;
  }
}

function addTag(id, text) {
$('#sub-product-list .filter > ul.keyword > li').each(function (i) {
    if ($(this).attr('data-category') == id) {
      return false;
    }
  });
  $('#sub-product-list .filter').addClass('on');
  $('#sub-product-list .filter > ul.keyword').append('<li data-category="' + id + '"><span class="text">' + text + '</span><a class="del">삭제</a></li>\n');
}
function delTag(type, id) {
  if (type === 'all') {
    $('#sub-product-list .filter').removeClass('on');
    $('#sub-product-list .filter > ul.keyword > li').remove();
  } else {
    $('#sub-product-list .filter > ul.keyword > li').each(function (i) {
      if (id == $(this).attr('data-category')) {
        $(this).remove();
        return false;
      }
    });
  }
}

function setToggleUI() {
  // $('a.btn-toggle').each(function() {
  //   var value = $(this).find('input').val();
  //   var valueLeft = $(this).find('input').attr('data-left');
  //   var valueRight = $(this).find('input').attr('data-right');
  //   $(this).attr({'title': value});
  //   if (value === valueRight) {
  //     $(this).addClass('on');
  //   } else {
  //     $(this).removeClass('on');
  //   }
  // });

  // $('a.btn-toggle').on('click', function() {
  //   var value = $(this).find('input').val();
  //   var valueLeft = $(this).find('input').attr('data-left');
  //   var valueRight = $(this).find('input').attr('data-right');
  //   if($(this).hasClass('disabled') === true){
  //     return false;
  //   }
  //   if ($(this).hasClass('on') === true) {
  //     $(this).removeClass('on');
  //     $(this).find('input').val(valueLeft);
  //     $(this).attr({'title': valueLeft});
  //   } else {
  //     $(this).addClass('on');
  //     $(this).find('input').val(valueRight);
  //     $(this).attr({'title': valueRight});
  //   }
  // });

  setTogglePW();
}
function setTogglePW() {
  $('.toggle-box').each(function(i) {
    $(this).addClass('hide');
  });

  $('.toggle-box > .btn-eye').on('click', function(e) {
    var $toggleBtn = $(this);
    var $toggleInput = $(this).siblings('input');
    var $toggleBox = $(this).parent();
    var isToggle = false;
    var toggleType = '';
    var toggleClass = '';

    isToggle = ($toggleInput.attr('type') === 'password') ? isToggle = true : isToggle = false;
    $toggleBox.removeClass('show hide');

    if(isToggle === true) {
      toggleType = 'text';
      toggleClass = 'show';
    } else {
      toggleType = 'password';
      toggleClass = 'hide';
    }

    $toggleInput.attr('type', toggleType);
    $toggleBox.addClass(toggleClass);
  });
}
class Tabview {
  #tabview = null;
  #tab = null;
  #tabContent = null;

  constructor(selector) {
    this.#tabview = $(selector);
    this.#tab = $(selector).find(' > .tab');
    this.#tabContent = $(selector).find(' > .tab-content ul.list');
    
    this.#setInitialStatus();
    this.#setEvent();
  }
  
  #setInitialStatus(){
    var that = this;
    this.#showTabView(1);
  }
  #setEvent() {
    var that = this;
    var $tab = this.#tab;

    $tab.find(' > li > a').on('click', function(e) {
      var index = $tab.find(' > li').index($(this).parent());
      that.#showTabView(index + 1);
    });
  }
  #showTabView(n) {
    this.#tab.find(' > li').removeClass('on');
    this.#tabContent.find(' > li').removeClass('on');
    this.#tab.find(' > li:eq(' + (n - 1) + ')').addClass('on');
    this.#tabContent.find(' > li:eq(' + (n - 1) + ')').addClass('on');
  }

  showTabview(n) {
    this.#showTabView(n);
  }
  getTab() {
    return this.#tab;
  }

}

function initModule() {
  setTabview();
  setImageSlide();
  setToggleUI();
  
  function setTabview() {
    $('.tabview').each(function(i) {
      var keyName = 'tabview' + (i + 1).toString();
      tabview[keyName] = new Tabview('.tabview:eq(' + i +' )');
    });
  }
  function setImageSlide() {
    $('.image-slider').each(function(i) {
      var keyName = 'imageslide' + (i + 1).toString();
      imageSlide[keyName] = new ImageSlide('.image-slider:eq(' + i +' )', {
        slideType: 'spring',
      });
    });
  }
}

class ImageSlide {
  #selector = null;
  #slideType = '';
  #numSlide = 0;
  #slideNow = 0;
  #slidePrev = 0; 
  #slideNext = 0;
  #slideFirst = 1;
  #startX = 0;
  #startY = 0;
  #delX = 0;
  #delY = 0;
  #offsetX = 0;
  #offsetY = 0;
  #direction = '';
  #hasTab = false;

  constructor(selector, options) {
    this.#selector = $(selector);
    this.#slideType = (options.slideType === undefined || options.slideType === undefined) ? 'default' : options.slideType;
    this.#numSlide = $(selector).find('.slide > li').length;
    this.#hasTab = ($(selector).parent('.tabview').length > 0) ? true : false;
    
    this.#setInitialStatus();
    this.#setEvent();
  }
  
  #setInitialStatus(){
    var that = this;
    this.#showSlide(1);
  }
  #setEvent() {
    var that = this;
    var $selector = this.#selector;
    var slideFirst = this.#slideFirst;

    that.#showSlide(slideFirst);

    $selector.find('.slide > li').each(function(i) {
      $(this).css({'left': (i * 100) + '%', 'display': 'block'});
    });
    $selector.find('.slide li a').on('focus', function() {
      var index = $selector.find('.slide li').index($(this).parent());
      $selector.find('div.box').scrollLeft(0);
      that.#showSlide(index + 1);
    });
    $selector.find('.control > a.prev').on('mouseenter', function () {
      if (that.#slideNow === 1) {
        return;
      }
      $(this).children('svg').children('path').attr("d", "M 40 10 Q 10 65 40 140");
      $(this).children('span').addClass('on');
    });
    $selector.find('p.control > a.next').on('mouseenter', function () {
      if (that.#slideNow === that.#numSlide) {
        return;
      }
      $(this).children('svg').children('path').attr("d", "M 10 10 Q 40 65 10 140");
      $(this).children('span').addClass('on');
    });
    $selector.find('p.control > a.prev').on('mouseleave', function () {
      $(this).children('svg').children('path').attr("d", "M 40 10 Q 40 65 40 140");
      $(this).children('span').removeClass('on');
    });
    $selector.find('p.control > a.next').on('mouseleave', function () {
      $(this).children('svg').children('path').attr("d", "M 10 10 Q 10 65 10 140");
      $(this).children('span').removeClass('on');
    });
    $selector.find('.control a.prev').on('click', function() {
      if (that.#slideNow === 1) {
        return;
      }
      that.#showSlide(that.#slidePrev);
    });
    $selector.find('.control a.next').on('click', function() {
      if (that.#slideNow === that.#numSlide) {
        return;
      }
      that.#showSlide(that.#slideNext);
    });
    if(this.#hasTab) {
      var $tab = $selector.parent('.tabview').find('.tab');
      $tab.find(' > li > a').on('click', function(e) {
        var index = $tab.find(' > li').index($(this).parent());
        that.#showSlide(index + 1);
      });
    }
    
    $selector.find('.slide').on('touchstart', function(e) {
      $(this).css({'transition': 'none'});
      that.#startX = e.touches[0].clientX;
      that.#startY = e.touches[0].clientY;
      that.#offsetX = $(this).position().left;
      that.#offsetY = $(this).position().top;

      document.addEventListener('touchmove', that.#touchMove(e, $selector), {passive: false});

      $(document).on('touchend', function(e) {
        if (that.#delX < - 30 && that.#slideNow !== that.#numSlide) {
          that.#showSlide(that.#slideNext);
        } else if (that.#delX > 30 && that.#slideNow !== 1) {
          that.#showSlide(that.#slidePrev);
        } else {
          that.#showSlide(that.#slideNow);
        }
        document.removeEventListener('touchmove', that.#touchMove(e, $selector));
        $(document).off('touchend');
        that.#direction = '';
        that.#delX = that.#delY = 0;
      });
    });
  } // end of setEvent()

  #touchMove(e) {
    var $selector = this.#selector;

    this.#delX = e.touches[0].clientX - this.#startX;
    this.#delY = e.touches[0].clientY - this.#startY;

    if (this.#direction === '') {
      // e.preventDefault();  없어야 됨
      if (Math.abs(this.#delX) > 8) {
        direction = 'horizon';
      } else if (Math.abs(this.#delY) > 8) {
        this.#direction = 'vertical';
      }
    } else if (this.#direction === 'vertical') {
      this.#delX = 0;
    } else if (this.#direction === 'horizon') {
      e.preventDefault();
      if ((this.#slideNow === 1 && this.#delX > 0) ||(this.#slideNow === this.#numSlide && this.#delX < 0)) {
        this.#delX = this.#delX / 10;
      }
      var percentLeft = (this.#offsetX + this.#delX) * 100 / $selector.innerWidth();
      $selector.find('.slide').css({'left': percentLeft + '%'});
    }
  }
  #showSlide(n) {
    var $selector = this.#selector;

    $selector.find('.slide > li').css({'display': 'none'});
    $selector.find('.slide > li:eq(' + (n - 1) + ')').css({'display': 'block'});
    if (this.#slideNow === 0) {
      $selector.find('.slide').css({'transition': 'none', 'left': (-(n - 1) * 100) + '%'});
    } else {
      $selector.find('.slide').css({'transition': 'left 0.3s', 'left': (-(n - 1) * 100) + '%'});
    }
    this.setSlideEffect(n);
    this.#slideNow = n;
    this.#slidePrev = (n === 1) ? this.#numSlide : (n - 1);
    this.#slideNext = (n === this.#numSlide) ? 1 : (n + 1);
    // console.log(slidePrev + ' / ' + slideNow + ' / ' + slideNext);
  }

  // sub page spring effect
  setSlideEffect(n) {
    var $selector = this.#selector;
    var slideNow = this.#slideNow;
    
    if (n === 1) {
      $selector.find('p.control > a.prev').addClass('first');
    } else if (n === this.#numSlide) {
      $selector.find('p.control > a.next').addClass('last');
    } else {
      $selector.find('p.control > a').removeClass('first last');
    }

    if (this.#slideType === 'spring') {
      tabview['tabview1'].showTabview(n);
      this.removeSlideEffect(slideNow);
      var textTimer1 = setTimeout(function() {$selector.find('.slide > li:eq(' + (n - 1) + ') > div.left > em').addClass('on');}, 200);
      var textTimer2 = setTimeout(function() {$selector.find('.slide > li:eq(' + (n - 1) + ') > div.left > p.title').addClass('on');}, 400);
      var textTimer3 = setTimeout(function() {$selector.find('.slide > li:eq(' + (n - 1) + ') > div.left > p.text').addClass('on');}, 600);
      $selector.find('.slide > li > div.left > ul.list > li').each(function(i) {
        var listTimer = setTimeout(function() {$selector.find('.slide > li:eq(' + (n - 1) + ') > div.left > ul.list > li:eq(' + (i) + ')').addClass('on');}, 600 + (200 * (i + 1)));
      });
      var imgTimer = setTimeout(function() {$selector.find('.slide > li:eq(' + (n - 1) + ') > div.right img').addClass('on');}, 1200);
    }
  }
  removeSlideEffect(n) {
    var $selector = this.#selector;

    if (this.#slideType === 'spring') {
      $selector.find('.slide > li:eq(' + (n - 1) + ') > div.left > em').removeClass('on');
      $selector.find('.slide > li:eq(' + (n - 1) + ') > div.left > p.title').removeClass('on');
      $selector.find('.slide > li:eq(' + (n - 1) + ') > div.left > p.text').removeClass('on');
      $selector.find('.slide > li > div.left > ul.list > li').each(function(i) {
        $selector.find('.slide > li:eq(' + (n - 1) + ') > div.left > ul.list > li').removeClass('on');
      });
      $selector.find('.slide > li:eq(' + (n - 1) + ') > div.right img').removeClass('on');
    }
  }
  // end of sub page spring effect

  
  prev() {
    this.#showSlide(this.#slidePrev);
  }
  next() {
    this.#showSlide(this.#slideNext);
  }
  showSlide(n) {
    this.#showSlide(n);
  }
  getNumSlide() {
    return this.#numSlide;
  }
  setNumSlide(n) {
    this.#numSlide = n;
  }
  getSlideNow(n) {
    return this.#slideNow;
  }
  setSlideNow(n) {
    this.#slideNow = n;
  }
  getSlidePrev(n) {
    return this.#slidePrev;
  }
  setSlidePrev(n) {
    this.#slidePrev = n;
  }
  getSlideNext(n) {
    return this.#slideNext;
  }
  setSlideNext(n) {
    this.#slideNext = n;
  }
  getHasTab(n) {
    return this.#hasTab;
  }
  setHasTab(n) {
    this.#hasTab = n;
  }
  
}