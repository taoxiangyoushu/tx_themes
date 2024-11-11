function exeData(num, type) {
    // loadData(num);
    loadpage();
}
function loadpage() {
    var myPageCount = parseInt($("#PageCount").val());
    var myPageSize = parseInt($("#PageSize").val());
    var countindex = myPageCount % myPageSize > 0 ? (myPageCount / myPageSize) + 1 : (myPageCount / myPageSize);
    $("#countindex").val(countindex);
    $.jqPaginator('#pagination', {
        totalPages: parseInt($("#countindex").val()),
        visiblePages: parseInt($("#visiblePages").val()),
        currentPage: 1,
        // first: '<li class="first"><a href="javascript:;">首页</a></li>',
        prev: '<li class="prev"><a href="javascript:;"><i class="arrow arrow2"></i><img src="https://api.taoxiangyoushu.com/html/v1/utils/img/arrow.png" alt=""></a></li>',
        next: '<li class="next"><a href="javascript:;"><i class="arrow arrow3"></i><img src="https://api.taoxiangyoushu.com/html/v1/utils/img/left-arrow.png" alt=""></a></li>',
        // last: '<li class="last"><a href="javascript:;">末页</a></li>',
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
            if (type == "change") {
                feedback(num);
                exeData(num, type);
            }
        }
    });
}
