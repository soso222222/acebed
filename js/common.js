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

  $(".category-matt input[type='checkbox']").change(function () {
    var categoryId = $(this).attr('id');
    var categoryType = '';
    var keyword = '';

    if ($(this).is(":checked")) {
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
    showList();
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
    showList();
  });
  $('#sub-product-list div.top > div.filter span.clear').on('click', function() {
    $(".category-matt input[type='checkbox']").prop('checked', false);
    $('#sub-product-list div.side ul > li > ul > li').removeClass('on');
    delTag('all');
    showList();
  });
  $('#sub-product-list div.paging p.number').on('click', 'a.page', function() {
    var index = $(this).index();
    showList(index);
  });
  $('#sub-product-list div.list-box ul.list').on('click', 'ul.info > a.like', function() {
    var likeTimer = '';
    
    var curLi = $(this).parent().parent().parent().parent();
    if(curLi.hasClass('liked')) {
      curLi.addClass('show-unlike');
      curLi.removeClass('liked');
      curLi.addClass('unliked');
      likeTimer = setTimeout(function() {curLi.removeClass('show-unlike');}, 2000);
      // $('#sub-product-list div.list-box ul.list > li div.unlike-alert').one('transitionEnd', function(){
      //   curLi.removeClass('unliked');
      // });
    }else {
      curLi.addClass('show-like');
      curLi.removeClass('unliked');
      curLi.addClass('liked');
      // $('#sub-product-list div.list-box ul.list > li div.like-alert').one('transitionEnd', function(){
      //   curLi.removeClass('liked');
      // });
      likeTimer = setTimeout(function() {curLi.removeClass('show-like');}, 2000);
    }
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

  $('#sub-product-list div.paging p.number').find('a').remove();

  $('#sub-product-list div.paging p.number').append('<a href="#" class="prev_first"></a>');
  for (var i = 0; i < (pages - 1); i++) {
    if (i === (curPage - 1)) {
      $('#sub-product-list div.paging p.number').append('<a href="#" class="page on">'+ (i + 1) + '</a>');
    } else {
      $('#sub-product-list div.paging p.number').append('<a href="#" class="page">'+ (i + 1) + '</a>');
    }
  }
  $('#sub-product-list div.paging p.number').append('<a href="#" class="next-last"></a>');
}

function showList(page) {
  var resultArr = bedInfoData;
  var categoryType = '';
  var categoryValue = '';
  var maxList = 12;
  var curPage = (page === undefined) ? 1 : page;
  var startPage = ((curPage - 1) * maxList) + 1;
  var endPage = (maxList * curPage);

  $('#sub-product-list ul.list > li').removeClass('on');
  $('#sub-product-list div.list-box ul.list').find('li').remove();
  
  $(".category-matt input[type='checkbox']:checked").each(function (index) {
    categoryType = $(this).attr('name');
    categoryValue = $(this).attr('value');
    
    resultArr = resultArr.filter(function (el, i) {
      var data = el[categoryType].toLowerCase().split('/');
      return data.indexOf(categoryValue) > -1;
    });
  });

  if (endPage > resultArr.length) {
    endPage = resultArr.length;
  }

  // $.each(resultArr, function (i, item) {
  for(var i = (startPage - 1); i < endPage; i++) {
    var item = resultArr[i];
    var categoryName = item['name'];
    var categorySize = item['category-size'].replaceAll('/', ' / ');
    var categoryRank = item['category-rank'].replaceAll('-', ' ');
    var imgSrc = item['img-src'];

    $('#sub-product-list div.list-box ul.list').append(
      `<li data-size="` + item['category-size'] + `" data-rank="` + item['category-rank'] + `" data-cushion="` + item['category-cushion'] + `" data-spring="` + item['category-spring'] + `" data-store="` + item['category-store'] + `">
          <ul class="content">
            <li>
              <a href="#">
                <img alt="" src="` + imgSrc + `" class="photo" />
                <div class="like-alert"><p><em>관심 제품으로<br />찜하였습니다.</em><br />마이페이지, 퀵 메뉴에서<br />확인하실 수 있습니다.</p></div>
                <div class="unlike-alert"><p>관심 제품에서<br /> 제외합니다.</p></div>
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
                <a href="#" class="like"><img alt="찜하기" src="../img/icon-like.png" /></a>
              </ul>
            </li>
          </ul>
      </li>`
    );
  // });
  }
  setPage(resultArr, curPage);
  $('#sub-product-list .top > p.total-product > strong.num').text(resultArr.length);

  $('#sub-product-list div.list-box ul.list > li').each(function(i) {
    var listupTimer = setTimeout(function() { $('#sub-product-list ul.list > li:eq(' + i + ')').addClass('on'); }, (i + 1) * 100);
  });

  // var listupTimer = setTimeout(function() { $('#sub-product-list ul.list').addClass('on'); }, 200);
    
  // $('#sub-product-list ul.list').addClass('on');
}







