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
    showList(type, index);
  });
  $('#sub-product-list div.list-box ul.list').on('click', 'ul.info > a.like', function() {
    var likeTimer = '';
    
    // var curLi = $(this).parent().parent().parent().parent();
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
  $('#sub-product-list div.list-box ul.list').on('mouseenter', 'p.palette > a', function () {
    var index = $(this).index();
    $(this).closest('li').find('div.color-info:eq(' + index + ')').addClass('on');
  }).on('mouseleave', 'p.palette > a', function () {
    $(this).closest('li').find('div.color-info').removeClass('on');
  });

}

function showRowView(row) {
  $('#sub-product-list ul.list > li').removeClass('on');
  $('#sub-product-list div.top > ul.arr-list > li.view > ul > li').removeClass('on');
  $('#sub-product-list div.list-box').removeClass('row-3 row-2');
  if (row == 'row-3') {
    $('#sub-product-list div.top > ul.arr-list > li.view > ul > li.row-3').addClass('on');
    $('#sub-product-list div.list-box').addClass(row);
  } else if (row == 'row-2') {
    $('#sub-product-list div.top > ul.arr-list > li.view > ul > li.row-2').addClass('on');
    $('#sub-product-list div.list-box').addClass(row);
  }
  
  $('#sub-product-list div.list-box ul.list > li').each(function(i) {
    var listupTimer = setTimeout(function() { $('#sub-product-list ul.list > li:eq(' + i + ')').addClass('on'); }, (i + 1) * 100);
  });
}
function setPage(list, curPage) {
  var maxList = 12;
  var pages = (list.length / maxList) + 1;
  var curPage = (curPage === undefined) ? 1 : curPage;
  // var startPage = '';
  // var endPage = pages;
  // var startList = ((curPage - 1) * maxList) + 1;
  // var endList = (maxList * curPage);

  $('#sub-product-list div.pages p.number').find('a').remove();

  // >> : 최종값 of pages > 10
  // << : 시작값 of pages > 11
  $('#sub-product-list div.pages p.number').append('<a href="#" class="prev_first"></a>');
  for (var i = 0; i < (pages - 1); i++) {
    if (i === (curPage - 1)) {
      $('#sub-product-list div.pages p.number').append('<a href="#" class="page on">'+ (i + 1) + '</a>');
    } else {
      $('#sub-product-list div.pages p.number').append('<a href="#" class="page">'+ (i + 1) + '</a>');
    }
  }
  $('#sub-product-list div.pages p.number').append('<a href="#" class="next-last"></a>');
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

    // `<li data-size="` + item['category-size'] + `" data-rank="` + item['category-rank'] + `" data-cushion="` + item['category-cushion'] + `" data-spring="` + item['category-spring'] + `" data-store="` + item['category-store'] + `">
    if(listType === 'bedMattressInfo'){
      var categoryRank = item['category-rank'].replaceAll('-', ' ');
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
                <li>
                  <p class="category-rank">` + categoryRank + `</p>
                </li>
                <a href="#" class="like"><img alt="찜하기" src="../img/icon-like.png" class="img-like" /></a>
              </ul>
            </li>
          </ul>
      </li>`;
    } else if(listType === 'bedFrameInfo') {
      var categoryType = item['category-type'];
      // var colors = item['color'];
      var colors = item['color'].split('|');
      var linkColor = '';
      var spanColor = '';
      var divColorInfo = ''

      if (Array.isArray(colors) === true) {
        $.each(colors, function (i) {
          spanColor = '<span class="color" style="background-color: ' + colors[i] + ';"></span>';
          linkColor += '<a href="#">' + spanColor + '</span></a>';
          divColorInfo += '<div class="color-info">' + spanColor + '<span class="colorName">' + colors[i] + '</span>' + '</div>';
        });
      } else {
        linkColor = '<a href="#"><span class="color" style="background-color: ' + colors + ';"></span></a>';
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
                <li>
                  <p class="category-type">` + categoryType + ` TYPE</p>
                </li>
                <li>
                  <p class="palette">` + linkColor + `</p>
                  ` + divColorInfo + `
                </li>
                <a href="#" class="like"><img alt="찜하기" src="../img/icon-like.png" class="img-like" /></a>
              </ul>
            </li>
          </ul>
      </li>`;
    }

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



function setViewRow() {
  var windowHeight = $(window).width();
  if ($(window).height() < 768){
    $('#sub-product-list div.list-box').removeClass('row-1');
    $('#sub-product-list div.list-box').addClass('row-2');
    $('ul.arr-list > li').removeClass('on');
    $('div.top-m ul.arr-list > li:first-child').addClass('on');
  }else{
    $('#sub-product-list div.list-box').removeClass('row-2');
    $('#sub-product-list div.list-box').addClass('row-3');
    $('ul.arr-list > li').removeClass('on');
    $('div.top ul.arr-list > li:first-child').addClass('on');
  }
}

function setLogo() {
  var windowHeight = $(window).width();
  if(windowHeight < 768){
    $('#mobile-menu img.black').css({'display': 'none'});
    $('#mobile-menu img.white').css({'display': 'black'});
  } else {
    $('#mobile-menu img.black').css({'display': 'black'});
    $('#mobile-menu img.white').css({'display': 'none'});
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




