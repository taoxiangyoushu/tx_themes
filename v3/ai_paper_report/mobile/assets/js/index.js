$('#basic').on('hidden.bs.select', function(e) {
    var tmpSelected = $('#basic').val();
    var nodes = $('.specialityBox .filter-option.pull-left')
    if(nodes.text() == '请选择您的论文专业') {
        nodes.removeClass('selected')
    }else {
        nodes.addClass('selected')
    }
    if (tmpSelected != null) {
        $('#roleid').val(tmpSelected);
    } else {
        $('#roleid').val("");
    }
    $('#ContainerTo').data('bootstrapValidator').updateStatus('roleid', 'NOT_VALIDATED').validateField('roleid');
});

$('#basic2').on('hidden.bs.select', function(e) {
    var tmpSelected = $('#basic2').val();
    if (tmpSelected != null) {
        $('#roleidsxbg').val(tmpSelected);
    } else {
        $('#roleidsxbg').val("");
    }
    $('#ContainerTo').data('bootstrapValidator').updateStatus('roleidsxbg', 'NOT_VALIDATED').validateField('roleidsxbg');
});

var configs = {
    "A":"其它（自动识别）",
    "F":"经济",
    "G4":"教育",
    "I":"文学",
    "R":"医药",
    "D9":"法律",
    "TP3":"计算机科学",
    "TU":"建筑科学",
    "T":"工业技术",
    "H":"护理学"
}
var title_record = {}  // 各商品已填写标题
function dropDown() {
    var selectObj = $("#basic");
    selectObj.find("option:not(:first)").remove();
    for (var i in configs) {
        var optionValue = i;
        if(optionValue != 'outher') {
            var optionText = configs[i];
            selectObj.append(new Option(optionText, optionValue));
        }
    }
    selectObj.selectpicker('refresh');

    // 实践报告的论文专业
    var selectObj2 = $("#basic2");
    selectObj2.find("option:not(:first)").remove();
    for (var i=0; i<SPECIALITY.length; i++) {
        selectObj2.append(new Option(SPECIALITY[i], i));
    }
    selectObj2.selectpicker('refresh');
}
dropDown()

// 学历
var education = 'bk'
$('#education').change(function (){
    education = $(this).val()
})

// 学历2
var NumberWords2 = '6000'
var education2 = 'bk'
$('#education2').change(function (){
    var textTips = {
        '4000': {
            text: '快速生成结构严谨、内容充实的基础论文，注重论文的基本要素和准确性',
            key: 'dz'
        },
        '6000': {
            text: '强调批判性思维和理论深度，支持更广泛的主题，含更高层次分析和论证',
            key: 'bk'
        },
        '8000': {
            text: '注重研究的创新性和深度，支持生成高度原创性和深入研究价值的论文',
            key: 'ss'
        },
    }
    NumberWords2 = $(this).val()
    education2 = textTips[NumberWords2].key
    $('#textTips').text(textTips[NumberWords2].text)
})

$(".addParameters input[type=checkbox]").on('click',function (event){
    event.stopPropagation()
    if($(this).parent().hasClass('deepen')) {
        $(this).parent().removeClass('deepen')
    }else {
        $(this).parent().addClass('deepen')
    }
})

var Radius = [5000 , 50000]
 // 控制字数和按钮的交互
$(".FruitBox").on('click','input',function(){
    $('.labelTitle').removeClass('selected')
    $('.' + $(this).val()).addClass('selected')
    $('#NumberWords').val($(this).val())
    // 清空报错提示
    $("#ContainerTo").data('bootstrapValidator').resetForm();
});
$('#NumberWords').keyup(function() {
    $('.labelTitle').removeClass('selected')
})

$("#contenteditable").bind("input propertychange", function(){
    $('.numberS').text($(this).val().length)
    title_record[$("#type_s").val()] = $(this).val()
});
$("#contenteditable2").bind("input propertychange", function(){
    title_record[$("#type_s").val()] = $(this).val()
});

$(".version-item").on('click',function (){
    $(".version-item").removeClass('active')
    $(this).addClass('active')
})

$('#type_s').change(function() {
    changeType($(this))
})

var Typetext=''
function Gettitle(){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
            if(pair[0]=='sw'){
                Typetext=decodeURI(pair[1])
            }
			if(pair[0]=='text'){
				$('#contenteditable').val(decodeURI(pair[1]))
				$('.numberS').text($('#contenteditable').val().length)
			}
	}
}
Gettitle()

function changeType(this_ , this_val) {
    var val = this_.val() || this_val
    var permit_name = ['rws' , 'ktbg' , 'wxzs' , 'kclw' , 'zjcaigc', 'dybg', 'lwdbppt' , 'xzaigccheck', 'scirs']
    var this_short_name = typeData[val].short_name

    // 标题处理
    if(typeData[val].short_name == 'xzaigccheck' || typeData[val].short_name == 'zjcaigc'){
        if(title_record[val]){
            $("#contenteditable2").val(title_record[val])
        }else{
            $("#contenteditable2").val('')
        }
    }else{
        if(title_record[val]){
            $("#contenteditable").val(title_record[val])
        }else{

            if(typeData[val].short_name==Typetext||typeData[val].short_name=='lwdbppt'||typeData[val].short_name=='sxbg'){
                Gettitle()
            }
            else{
                $("#contenteditable").val('')
            }
        }
    }

    if(permit_name.includes(this_short_name)) {
        $('.NumberIsShow').hide()
        if(this_short_name == 'wxzs' && $(".version-wxzs2").attr('data-goodsid')){
            $(".version-wxzs").show()
        }else{
            $(".version-wxzs").hide()
            $(".version-item").removeClass('active')
        }
    }else {
        // 重置字数
        var NumberWords = typeData[val].WordCount
        var FruitBoxHrml = ''
        for(let i=0; i< NumberWords.length; i++) {
            FruitBoxHrml+= "<input name='Fruit' type='radio' value='"+NumberWords[i]+"' id='"+NumberWords[i]+"'/><label class='"+NumberWords[i]+" labelTitle' for='"+NumberWords[i]+"'>"+NumberWords[i]+"字</label>"
        }
        $('.FruitBox').html(FruitBoxHrml)
        // 修改字数
        Radius = typeData[val].Radius
        $('#NumberWords').attr('placeholder' , Radius[0]+'-'+Radius[1]+'字内,不满千字按千字计算')
        $('.NumberIsShow').show()
        $(".version-wxzs").hide()
    }
    var short_name_arr = ['rws' , 'ktbg' , 'qklw' , 'wxzs' , 'kclw' , 'zjcaigc', 'dybg', 'lwdbppt' , 'sxbg' , 'xzaigccheck', 'scirs']
    if(short_name_arr.includes(this_short_name)){
        if(this_short_name !== 'dybg'){
            $(".educationBox").hide() // 学历
        }
        if(this_short_name !== 'lwdbppt'){
            $(".specialityBox").hide() // 专业
        }
        $(".keywordBox").hide() // 关键词
    }else{
        if(parameterSet[this_short_name].submit_attribute.value.education.value){
            $(".educationBox").show()
        }
        if(parameterSet[this_short_name].submit_attribute.value.keyword.value){
            $(".keywordBox").show()
        }
        if(parameterSet[this_short_name].submit_attribute.value.major.value){
            $(".specialityBox").show()
        }
    }

    if(this_short_name !== 'bylw' && this_short_name !== 'qklw'&& this_short_name !== 'kclw') {   //图表
        $('.genIT').hide()
        $(".addParameters").hide()
    }else{
        $('.genIT').show()
        $(".addParameters").show()
        $('.genCode').show()
        $('.genaiimg').show()
        $('.Sample_Chart').show()
        $('.Sample_Chart1').hide()
        if(this_short_name =='kclw'){
            $('.genCode').hide()
            $('.genaiimg').hide()
            $('.Sample_Chart1').show()
            $('.Sample_Chart').hide()
            $('.questionnaire').hide()
            $('.addParameters').addClass('kclw_box')
        }else {
            $('.addParameters').removeClass('kclw_box')
            $('.questionnaire').show()
        }
    }
    if(this_short_name == 'kclw'){    // 课程论文
        $('.EducationalAltitude').show()
    }else {
        $('.EducationalAltitude').hide()
    }

    if(['bylw'].includes(this_short_name)){
        $(".proposalBox  , .tabDiv").show();
    }else{
        $(".proposalBox  , .tabDiv").hide();
    }
    if(['ktbg' , 'qklw'].includes(this_short_name)) {
        $(".tabDiv").show();
    }

    if(this_short_name == 'dybg' || this_short_name == 'ktbg'||this_short_name=='rws'){
        $(".educationBox").show() // 学历
    }
    var shortName = this_short_name
    if(shortName == 'zjcaigc') {
        editionType(shortName)
        $('.jiangAIGCContent').show()
        file_path = ''
        if($("#ThesisInput").val()){
            $(".deleteFileThesis").click()
        }
    }else {
        editionType(shortName == 'bylw'? 'Normal':shortName)
        $('.jiangAIGCContent').hide()
    }

    if(this_short_name == 'xzaigccheck') { // aigc查重
        file_path = ''
        if($("#ThesisInput").val()){
            $(".deleteFileThesis").click()
        }
        $('.xzaigccheck_conditions , .jiangAIGCContent').show()
        $('.filSize').text(10)
    }else {
        $('.xzaigccheck_conditions').hide()
        $('.filSize').text(15)
    }

    if(this_short_name !== 'bylw' && this_short_name !== 'ktbg' && this_short_name !== 'kclw' && this_short_name !== 'qklw'){    //参考文献
        $(".EnglishReferenceShow").hide()
        $(".EnglishReferenceTip").hide()
    }else {
        $(".EnglishReferenceShow").show()
        $(".EnglishReferenceTip").show()
        if(this_short_name == 'bylw' || this_short_name == 'qklw') {
            $('.EnglishReference-check').attr('checked', false)
            $(".inputBox-en").hide()
        }
    }

    if(this_short_name == 'lwdbppt'){
        $(".specialityBox").show() // 专业
        $('.jiangAIGCContent').show()
        file_path = ''
        if($("#ThesisInput").val()){
            $(".deleteFileThesis").click()
        }
    }

    if(this_short_name == 'sxbg') { // 实践报告
        $(".specialityBoxsxbg").show()
    }else {
        $(".specialityBoxsxbg").hide()
    }

    if(this_short_name == 'scirs') { // SCI润色
        $(".SCI_form").show()
    }else {
        $(".SCI_form").hide()
    }

    // 清空报错提示
    $("#ContainerTo").data('bootstrapValidator').resetForm();
}


$("#ContainerTo").bootstrapValidator({
    excluded: [':disabled',':hidden'], //[':disabled', ':hidden', ':not(:visible)'] //设置隐藏组件可验证
    feedbackIcons: {
        valid: 'glyphicon',
        invalid: 'glyphicon',
        validating: 'glyphicon'
    },
    fields: {
        roleid: {
            container: "#basic_err",
            validators: {
                notEmpty: {
                    message: '专业不能为空'
                }
            }
        },
        roleidsxbg: {
            container: "#basic2_err",
            validators: {
                notEmpty: {
                    message: '专业不能为空'
                }
            }
        },
        title: {
            container: "#title_err",
            validators: {
                callback: {
                    message: '作者不能为空且最多15个字',
                    callback: function (value, validator, $field) {
                        if(value.length>=1 && value.length<=15) {
                            return true
                        }else {
                            return false
                        }
                    }
                }
            }
        },
        contenteditable: {
            container: "#contenteditable_err",
            validators: {
                callback: {
                    message: '论文标题不能为空且最少5个字',
                    callback: function (value, validator, $field) {
                        if(value.length>=5 && value.length<=50) {
                            return true
                        }else {
                            return false
                        }
                    }
                }
            }
        },

        contenteditable2: {
            container: "#contenteditable2_err",
            validators: {
                callback: {
                    message: '论文标题不能为空且最多60个字',
                    callback: function (value, validator, $field) {
                        if(value.length>=1 && value.length<=60) {
                            return true
                        }else {
                            return false
                        }
                    }
                }
            }
        },


        NumberWords: {
            container: "#NumberWords_err",
            validators: {
                callback: {
                    // message: '字数应为'+Radius[0]+'至'+Radius[1]+'',
                    callback: function (value, validator, $field) {
                        if(value>=Radius[0] && value<=Radius[1]) {
                            return true
                        }else {
                            return { valid : false, message: '字数应为'+Radius[0]+'至'+Radius[1]+''}
                        }
                    }
                }
            }
        },
        keyword: {
            container: "#keyword_err",
            validators: {
                callback: {
                    message: '关键词最少填写3个，最多填写8个',
                    callback: function (value, validator, $field) {
                        var arr1 = []
                        slicing(value,arr1)
                        if(arr1.length > 8 || (arr1.length!==0 && arr1.length< 3)){
                            return false
                        }else{
                            return  true
                        }
                    }
                }
            }
        },
        textareaName: {
            container: "#jiangAIGCContent_err",
            validators: {
                callback: {
                    message: '内容长度需要在[200-300000]字之间',
                    callback: function (value, validator, $field) {
                        if(value.length>=200 && value.length<=300000) {
                            return true
                        }else {
                            return false
                        }
                    }
                }
            }
        },
        docUpload: {
            container: "#jiangAIGCContent_err2",
            validators: {
                notEmpty: {
                    message: '文档不能为空'
                }
            }
        }

    }
});
let throttling = true;
if(getQueryVariable('qhclickid')) {
    window.localStorage.setItem('qhclickid',getQueryVariable('qhclickid'))
}
if(getQueryVariable('bd_vid')) {
    window.localStorage.setItem('bd_vid',window.location.href)
}
$('.generate').click(function() {
    if(!$('#type_s').val()){
        return;
    }
    if(!$('.inputCheck').prop("checked")) {
        toast('请确认知晓并同意 "生成的论文范文仅用于参考,不作为毕业、发表使用" 条款!', 3000)
        return
    }
    if( typeData[$('#type_s').val()].short_name=='bylw' && $(".proposal-check").is(':checked') && !fid && !ktbg_generate) {
        $("#proposal_err").text('请上传开题报告')
        $("#proposal_err").show();
        return;
    }else{
        $("#proposal_err").hide();
    }
    var bootstrapValidator = $("#ContainerTo").data("bootstrapValidator").validate();
    if (bootstrapValidator.isValid()) {
        if(!throttling) return
        if(typeData[$('#type_s').val()].short_name == 'lwdbppt' && $(".AIGCContentType.Select").attr('id-key')=='1'){
            upload_lwdbppt()
            return
        }
        if( typeData[$('#type_s').val()].short_name=='scirs' ){
            upload_sci()
            return
        }
        var wxzsID = ''
        if(typeData[$('#type_s').val()].short_name == 'wxzs' && $(".version-wxzs2").attr('data-goodsid')){
            if(!$(".version-item.active").attr('data-goodsid')){
                toast('请选择版本', 2000)
                return;
            }else{
                wxzsID = $(".version-item.active").attr('data-goodsid')
            }
        }
        toast({
            msg: '正在提交,请稍后...',
            type: 'loading',
            time: 20000
        })
        var pathName = ''
        var locationPathname = window.location.pathname
        if(locationPathname.slice(locationPathname.length-1,locationPathname.length) !== '/'){
            locationPathname += '/'
        }
        if(window.location.pathname.indexOf('index.html') != -1){
            pathName = window.location.pathname.replace('index.html','query.html')
        }else{
            pathName =  locationPathname + 'query.html'
        }
        var formData = {
            goods_id: $("#type_s").val(),
            frontNotifyUrl: window.location.origin+ pathName + '?oid=#outTradeNo#',
            domain_record: window.location.origin, // 本地测试需要替换写死, 上线前切记恢复自动获取
            source: /MicroMessenger/.test(window.navigator.userAgent)? 2:7,
            customer_invitation: dct_code,
            theme:'v3',
        }
        if(typeData[$('#type_s').val()].short_name == 'wxzs' && wxzsID){
            formData.goods_id = wxzsID
        }

        if((typeData[$('#type_s').val()].short_name == 'bylw' || typeData[$('#type_s').val()].short_name == 'lwdbppt' || typeData[$('#type_s').val()].short_name == 'sxbg') && $("#basic").val() && $("#basic").val() !== 'A'){
            if($(".specialityBox").is(':visible')){
                formData['data[paper_type][label]'] = '论文类型'
                formData['data[paper_type][value]'] = configs[$("#basic").val()]
            }
        }else{
        }
        var KEYWORD = []
        slicing($("#keyword").val(),KEYWORD)

       if(typeData[$('#type_s').val()].short_name == 'bylw' || typeData[$('#type_s').val()].short_name == 'qklw'||typeData[$('#type_s').val()].short_name == 'kclw'){
            if($(".keywordBox").is(':visible')){
                formData['data[keyword][label]'] = '关键词'
                formData['data[keyword][value]'] = KEYWORD.join('；')
            }
            if($(".educationBox").is(':visible')){
                formData['data[education][label]'] = '学历'
                formData['data[education][value]'] = education;
            }
            formData['data[gen_tab][label]'] = '生成表格'
            formData['data[gen_tab][value]'] = $(".gen_tab").is(':checked')?1:0
            formData['data[gen_img][label]'] = '生成图片'
            formData['data[gen_img][value]'] =  $(".gen_img").is(':checked')?1:0
            formData['data[gen_formula][label]'] = '生成公式'
            formData['data[gen_formula][value]'] =  $(".gen_formula").is(':checked')?1:0
            if(typeData[$('#type_s').val()].short_name != 'kclw') {
                formData['data[gen_code][label]'] = '生成代码'
                formData['data[gen_code][value]'] =  $(".gen_code").is(':checked')?1:0
                formData['data[questionnaire][label]'] = '生成调查问卷'
                formData['data[questionnaire][value]'] =  $(".gen_questionnaire").is(':checked')?1:0
                formData['data[gen_ai_img][label]'] = '生成图片'
                formData['data[gen_ai_img][value]'] =  $(".gen_ai_img").is(':checked')?1:0
            }
       }
       if(typeData[$('#type_s').val()].short_name == 'bylw' && !$(".proposal-check").is(':checked')) {
            // 判断英文参考文献
            if(!LiteratureFU()) return;
            // 英文参考
            var LiteratureType = $(".EnglishReference-check").is(':checked');
           formData['data[references_en_num][label]'] = '英文参考文献数量'
            if(LiteratureType) {
                formData['data[references_en_num][value]'] = $('#NumberEnglishReference').val()
            }else {
                formData['data[references_en_num][value]'] = 0
            }
       }
        if(typeData[$('#type_s').val()].short_name == 'ktbg' || typeData[$('#type_s').val()].short_name == 'kclw' || typeData[$('#type_s').val()].short_name == 'qklw') {
            // 判断英文参考文献
            if(!LiteratureFU()) return;
            // 英文参考
            var LiteratureType = $(".EnglishReference-check").is(':checked');
            formData['data[references_en_num][label]'] = '英文参考文献数量'
            if(LiteratureType) {
                formData['data[references_en_num][value]'] = $('#NumberEnglishReference').val()
            }else {
                formData['data[references_en_num][value]'] = 0
            }
        }
        var noNumberWords = ['rws' , 'ktbg' , 'wxzs' , 'zjcaigc' , 'dybg' , 'lwdbppt' , 'xzaigccheck']
        if(noNumberWords.indexOf(typeData[$('#type_s').val()].short_name) == -1) {
            formData['data[word_num][label]'] = '生成字数'
            if(typeData[$('#type_s').val()].short_name == 'kclw') {
                formData['data[word_num][value]'] = NumberWords2
                formData['data[education][label]'] = '学历';
                formData['data[education][value]'] = education2;
            }else {
                formData['data[word_num][value]'] = $("#NumberWords").val()
            }
        }
        if(typeData[$('#type_s').val()].short_name == 'dybg'){
            formData['data[education][label]'] = '学历';
            formData['data[education][value]'] = education;
        }
        if(window.localStorage.getItem('qhclickid')) {
            formData['qhclickid'] =  window.localStorage.getItem('qhclickid')
        }
        if(window.localStorage.getItem('bd_vid')) {
            formData['bd_vid'] =  window.localStorage.getItem('bd_vid')
        }
        if($(".proposal-check").is(':checked') && typeData[$('#type_s').val()].short_name == 'bylw'){
            if(fid){
                formData['data[gen_ktbg][label]'] = '开题报告';
                formData['data[gen_ktbg][value]'] = $(".proposal-check").is(':checked')?1:0;
                formData['data[fid][label]'] = '文件标识';
                formData['data[fid][value]'] = fid;
            }
            if(ktbg_generate){
                formData['order_sn'] = ktbg_generate;
            }
        }
        var hasKtbg = fid?fid:ktbg_generate

        formData['data[title][label]'] = '论文标题'
        // 降aigc
        if(typeData[$('#type_s').val()].short_name == 'zjcaigc') {
            formData['data[title][value]'] = $('#contenteditable2').val()
            // formData['data[paper_type][label]'] = '论文类型';
            // formData['data[paper_type][value]'] = $("input[name='FamilyCategory']:checked").val();
            formData['upload_type'] = $('.AIGCContentType.Select').attr('id-key');
            if($('.AIGCContentType.Select').attr('id-key') == 1) {
                formData['content'] = $('#textareaText').val();
            }else {
                formData['data[file_path][label]'] = '文件地址';
                formData['data[file_path][value]'] = file_path;
            }
        }else {
            formData['data[title][value]'] = $('#contenteditable').val()
        }

        // 查aigc
        if(typeData[$('#type_s').val()].short_name == 'xzaigccheck'){
            formData['data[author][label]'] = '论文作者'
            formData['data[author][value]'] = $('#author').val()

            formData['upload_type'] = $('.AIGCContentType.Select').attr('id-key');
            if($('.AIGCContentType.Select').attr('id-key') == 1) {
                formData['content'] = $('#textareaText').val();
            }else {
                formData['data[file_path][label]'] = '文件地址';
                formData['data[file_path][value]'] = file_path;
            }
            formData['data[title][value]'] = $('#contenteditable2').val()
        }

        if(typeData[$('#type_s').val()].short_name == 'lwdbppt'){
            formData['data[file_path][label]'] = '文件地址';
            formData['data[file_path][value]'] = file_path;
        }

        // 实践报告
        if(typeData[$('#type_s').val()].short_name == 'sxbg' && SPECIALITY[$("#basic2").val()]!='其他（自动识别）') {
            formData['data[paper_type][label]'] = '论文类型';
            formData['data[paper_type][value]'] = SPECIALITY[$("#basic2").val()]
        }
        // 开题报告(极速版)
        if(typeData[$('#type_s').val()].short_name == 'ktbg' || typeData[$('#type_s').val()].short_name == 'rws'){
            formData['data[education][label]'] = '学历'
            formData['data[education][value]'] = education;
        }
        var form_data = getFormData(formData)
        throttling = false
        unifiedCreate(form_data, hasKtbg)
    }
})

function unifiedCreate(form_data, hasKtbg){
    $.ajax({
        type: 'post',
        url: urls + '/api/client/order/unified/create?user_token='+USER_TOKEN+'&jane_name='+JANE_NAME+(suffix?'&'+suffix:'') + (suffix2?'&'+suffix2:''),
        data: form_data,
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            // toastNone()
            if (data.code == 200) {
                throttling = true
                // 降aigc的使用后端返回的文字，其他使用自己输入的文字数
                var NumberWords = 0
                var PaperTypeName = ''
                if(typeData[$('#type_s').val()].short_name == 'zjcaigc') {
                    NumberWords = data.data.word_num
                    PaperTypeName = $("input[name='FamilyCategory']:checked").val()
                }else {
                    NumberWords = form_data.get('data[word_num][value]')
                }
                if (/MicroMessenger/.test(window.navigator.userAgent) && payWay_Info.wx && payWay_Info.wx_jsapi) {  // 微信浏览器
                    location.href = './pay.html?commitId=' + data.data.order_sn + '&order_amount=' + data.data.order_amount+ '&contentType=' + form_data.get('goods_id') + '&goods=&payId=' + '&zxktbg=' + hasKtbg + '&wordNum=' + NumberWords + '&getOpenId=true';
                    return
                }
                location.href = './pay.html?commitId=' + data.data.order_sn + '&order_amount=' + data.data.order_amount+ '&contentType=' + form_data.get('goods_id') + '&goods=&payId=' + '&zxktbg=' + hasKtbg + '&wordNum=' + NumberWords;
            } else {
                throttling = true
                toast(data.codeMsg)
            }
        },
        error: function(err) {
            // toastNone()
            throttling = true
            // error_dl(err)
        }
    });
}

function findMin(array){
    var _min = array[0];    //假设最小的数就是    array[0]
    var _indexMin = 0;        //假设最小的数的下标就是0
    for(var i=0;i<array.length;i++){
        if(array[i] < _min){ //如果其他元素大于我们假设的值，证明我们假设的值不是最小的
            _min = array[i]; //重置_min的值
            _indexMin = i;
        }
    }
    return _min
};

function slicing(str,arr){
    let I1 = str.indexOf(';') !== -1? str.indexOf(';') : ''
    let I2 = str.indexOf('；') !== -1? str.indexOf('；') : ''
    let I3 = str.indexOf('，') !== -1? str.indexOf('，') : ''
    let I4 = str.indexOf(',') !== -1? str.indexOf(',') : ''
    let I5 = str.indexOf('、') !== -1? str.indexOf('、') : ''
    let c1 = []
    if(I1 || I1===0){
        c1.push(I1)
    }
    if(I2 || I2===0){
        c1.push(I2)
    }
    if(I3 || I3===0){
        c1.push(I3)
    }
    if(I4 || I4===0){
        c1.push(I4)
    }
    if(I5 || I5===0){
        c1.push(I5)
    }
    let min = findMin(c1)
    if(min || min===0){
        arr.push(str.slice(0,min))
        slicing(str.slice(min+1),arr)
    }
    if(c1.length == 0 && str.length!==0){
        arr.push(str)
    }
};

$('.query').on('click',function (){
    window.location.href = './query.html'
})
$("#NumberWords").bind("input propertychange",function () { // 控制只能输入数字
    $(this).val($(this).val().replace(/^\D/g,''));
});

$(".sample").on('click',function (){
    $(".sampleMask").show();
    $(".samplePop").show();
})
$(".sampleClose").on('click',function (){
    $(".sampleMask").hide();
    $(".samplePop").hide();
    $('.zslwPop').hide()
    $('.zsbgPop').hide()
})
$(".sampleMask").on('click',function (){
    $(".sampleMask").hide();
    $(".samplePop").hide();
    $('.zslwPop').hide()
    $('.zsbgPop').hide()
})
$(".sam-zsbg").on('click',function (){
    $('.sampleMask').show()
    $('.zsbgPop').show()
})
$(".sam-zslw").on('click',function (){
    $('.sampleMask').show()
    $('.zslwPop').show()
})
$(".profession").on('click',function (){
    $(".mask").show();
    $(".dashi_fz").show();
})
$(".close-fz").on('click',function (){
    $(".mask").hide();
    $(".dashi_fz").hide();
})
var clipboard = new Clipboard('.copy_url', {
    text: function () {
        return window.location.href;
    },
});

//复制成功响应
clipboard.on('success', function (e) {
    $(".mask").hide();
    $(".dashi_fz").hide();
    toast({
        msg: "复制成功",
        type: 'success',
        time: 2000
    })
});

//复制失败响应
clipboard.on('error', function (e) {
    toast({
        msg: "复制失败!请重新尝试",
        type: 'error',
        time: 2000
    })
});
$(".fixed-problem").on('click',function (){
    $(".myProblems").show()
    $(".mask").show()
    document.body.style.height = '100vh'
    document.body.style['overflow-y'] = 'hidden'
})
$(".p-item").on('click',function (){
    if($(this).hasClass('activePr')){
        $(".p-item").removeClass('activePr')
        $(".p-a").stop(false,true).slideUp(100)
        return
    }
    $(".p-a").stop(false,true).slideUp(100)
    $(".p-item").removeClass('activePr')
    $(this).addClass('activePr')
    $($(this).find('.p-a')).stop(false,true).slideDown(100)
})

//自写开题报告
var fid = ''
$(".proposal-text").on('click',function (){
    $(".proposal-check").click()
})

$(".proposal-check").on('change', function (){

    if($(".proposal-check").is(':checked')){
        // $(".uploadText").css({display:'inline-block',verticalAlign:'top'})
        $(".upk_mask").show()
        $(".uploadKTBG_pop").slideDown()
        $(".EnglishReferenceShow").hide()
        $(".EnglishReferenceTip").hide()
    }else{
        // $(".uploadText").hide()
        $(".upk_mask").hide()
        $(".uploadKTBG_pop").slideUp()
        $(".EnglishReferenceShow").show()
        $(".EnglishReferenceTip").show()
        $("#proposal_err").hide()
    }
})

$(".uploadText").on('click', function (){
    $("#uploadFile").click()
})

$("#uploadFile").on('change',function (){
    if($("#uploadFile")[0].files[0]){
        $(".file-name").text($("#uploadFile")[0].files[0].name)
        $(".upload-block").hide()
        $(".proposal-file").show()
        $("#proposal_err").hide();
        $(".uploadKTBG_pop .upk_btn .upk_ico").hide()
        $(".uploadKTBG_pop .upk_btn .upk_ing").show()
        $(".uploadKTBG_pop .upk_btn span").text('正在上传文件')
        $(".uploadKTBG_pop .upk_btn").addClass('upking')
        var formdata = new FormData()
        formdata.append('file',  $("#uploadFile")[0].files[0])
        $.ajax({
            type: 'POST',
            url: urls + '/api/project/ai_paper_report/pre_handle/ktbg_upload',
            processData: false,
            contentType: false,
            xhrFields: {
                withCredentials: true
            },
            data: formdata,
            success: function (res){
                if(res.code == 200){
                    fid = res.data.fid
                    $(".upk_mask").hide()
                    $(".uploadKTBG_pop").slideUp()
                }else{
                    if(res.codeMsg){
                        toast({
                            msg: res.codeMsg,
                            type: 'error',
                            time: 2000,
                            zIndex: 1003,
                        })
                    }else{
                        toast({
                            msg: '文件上传失败，请重试',
                            type: 'error',
                            time: 2000,
                            zIndex: 1003,
                        })
                    }
                    $("#proposal_err").text('文件上传失败，请重试')
                    $("#proposal_err").show();
                    $('.delete-file').click();
                }
            },
            complete: function (res){
                $(".uploadKTBG_pop .upk_btn .upk_ico").show()
                $(".uploadKTBG_pop .upk_btn .upk_ing").hide()
                $(".uploadKTBG_pop .upk_btn span").text('上传开题报告')
                $(".uploadKTBG_pop .upk_btn").removeClass('upking')
            }
        })
    }else{
        $(".file-name").text('')
        $(".upload-block").show()
        $(".proposal-file").hide()
    }
})

$(".delete-file").on('click', function (){
    $("#uploadFile").val('')
    $("#uploadFile").trigger('change')
    $("#proposal_err").hide();
    $(".proposal-file").removeClass('active')
    fid = '';
    ktbg_generate = false
    $(".proposal-check").attr('checked', false)
    $(".proposal-check").trigger('change')
})

// 开题报告生成论文
var ktbg_generate = false
if(getQueryVariable('ktbg')){
    ktbg_generate = getQueryVariable('ktbg')
}
function ktbgGenerate(){
    if(getQueryVariable('ktbg')) {
        var bylw = '';
        for(key in typeData){
            if(typeData[key].short_name == 'bylw'){
                bylw = key
            }
        }
        if($('#type_s').val() !== bylw){
            setTimeout(function (){
                $('#type_s').val(bylw)
                $("#type_s").trigger('change')
                $('#contenteditable').val(getQueryVariable('title'))
                $("#contenteditable").trigger('input')
                $(".proposal-check").click()
                $(".upload-block").hide()
                $(".file-name").text(getQueryVariable('title') + '-开题报告.docx')
                $(".proposal-file").addClass('active')
                $(".proposal-file").show()
            },0)
        }
        if($('#type_s').val() == bylw){
            $('#contenteditable').val(getQueryVariable('title'))
            $(".proposal-check").click()
            $(".upload-block").hide()
            $(".file-name").text(getQueryVariable('title') + '-开题报告.docx')
            $(".proposal-file").addClass('active')
            $(".proposal-file").show()
        }
    }
}

// AIGC科类
$('.AIGCContentType').click(function() {
    $("#ContainerTo").data('bootstrapValidator').resetForm();
    $('.AIGCContentType').removeClass('Select')
    $(this).addClass("Select")
    if($(this).attr('id-key') == 1) {
        $('.InputBox').show()
        $('.UploadBox').hide()
    }else {
        $('.InputBox').hide()
        $('.UploadBox').show()
    }
})

// 早降重 - 降aigc率
var file_path = ''
$("#ThesisInput").on('change',function (){
    if($(this)[0].files[0]){
        $('.Not , .UploadedSuccess , .UploadFailed').hide()
        $('.Complete , .Loading , .lodingGif').show()
        var fileName = $("#ThesisInput")[0].files[0].name
        $(".fileNameThesis").text(fileName);
        var formdata = new FormData()
        formdata.append('file', $("#ThesisInput")[0].files[0])
        formdata.append('type', typeData[$('#type_s').val()].short_name)
        $.ajax({
            type: 'POST',
            url: urls + '/api/project/ai_paper_report/pre_handle/file_upload',
            processData: false,
            contentType: false,
            xhrFields: {
                withCredentials: true
            },
            data: formdata,
            success: function (res){
                if(res.code == 200){
                    $('.Not , .UploadFailed , .Loading , .lodingGif').hide()
                    $('.Complete , .UploadedSuccess').show()
                    file_path = res.data.path
                }else{
                    UploadFailed()
                    if(res.codeMsg){
                        toast({
                            msg: res.codeMsg,
                            type: 'error',
                            time: 2000
                        })
                    }else{
                        toast({
                            msg: '文件上传失败，请重试',
                            type: 'error',
                            time: 2000
                        })
                    }
                }
                fileNameImgType(fileName)
            },
            error: function() {
                UploadFailed()
                fileNameImgType(fileName)
                toast({
                    msg: '文件上传失败，请重试',
                    type: 'error',
                    time: 2000
                })
            }
        })
    }else{
        UploadFailed()
    }
})

function fileNameImgType(fileName) {
    if(fileName.slice(fileName.lastIndexOf(".") + 1) == 'txt') {
        $('.DocumentText').show()
        $('.DocumentWord').hide()
    }else {
        $('.DocumentText').hide()
        $('.DocumentWord').show()
    }
}
function UploadFailed() {
    $('.Not , .UploadedSuccess , .Loading , .lodingGif , .DocumentText , .DocumentWord').hide()
    $('.Complete , .UploadFailed').show()
    file_path = ''
}


$(".deleteFileThesis").on('click',function (){
    $("#ThesisInput").val('')
    $("#ThesisInput").trigger('change');
    $('.Not').show()
    $('.Complete').hide()
})
$(".toCheck").on('click',function (){
    $(this).find(".FamilyCategory").click()
})
$(".FamilyCategory").on('click',function (event){
    event.stopPropagation()
})

// 英文参考文献
// $('.Prohibited div').click(function() {
//     $('.Prohibited div').removeClass('Select')
//     $(this).addClass('Select')
//     if($(this).attr('idKey') == 'zdy') {
//         $('.EnglishReferenceShow').css('display' , 'flex')
//     }else {
//         $('.EnglishReferenceShow').hide()
//     }
// })

$("#NumberWords").change(function (){
    if(!$("#NumberWords").val()){
        $('.EnglishReference-check').attr('checked', false)
        $(".inputBox-en").hide()
    }
})

$(".EnglishReference-text").on('click',function (){
    $(".EnglishReference-check").click()
})

$(".EnglishReference-check").on('click',function (event){
    event.stopPropagation()
    if(!$("#NumberWords").val() && (typeData[$('#type_s').val()].short_name=='bylw' || typeData[$('#type_s').val()].short_name=='qklw')){
        $('.EnglishReference-check').attr('checked', false)
        toast('请先选择字数', 2000)
        return
    }
    if($(this).is(':checked')){
        $(".inputBox-en").show()
    }else{
        $(".inputBox-en").hide()
    }
})

$(".decreaseBtn").on('click',function (){
    let num = $("#NumberEnglishReference").val() || 0
    if(num>0){
        $("#NumberEnglishReference").val(Number(num) - 1)
    }
})

$(".addBtn").on('click',function (){
    let num = $("#NumberEnglishReference").val() || 0
    $("#NumberEnglishReference").val(Number(num) + 1)
})

function upload_lwdbppt() {
    toast({
        msg: '正在提交,请稍后...',
        type: 'loading',
        time: 20000
    })
    throttling = false
    var formdata = new FormData()
    formdata.append('content', $("#textareaText").val())
    formdata.append('type', typeData[$('#type_s').val()].short_name)
    $.ajax({
        type: 'POST',
        url: urls + '/api/project/ai_paper_report/pre_handle/file_upload',
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        data: formdata,
        success: function (res){
            if(res.code == 200){
                var pathName = ''
                var locationPathname = window.location.pathname
                if(locationPathname.slice(locationPathname.length-1,locationPathname.length) !== '/'){
                    locationPathname += '/'
                }
                if(window.location.pathname.indexOf('index.html') != -1){
                    pathName = window.location.pathname.replace('index.html','query.html')
                }else{
                    pathName =  locationPathname + 'query.html'
                }
                var formData = {
                    goods_id: $("#type_s").val(),
                    frontNotifyUrl: window.location.origin+ pathName + '?oid=#outTradeNo#',
                    domain_record: window.location.origin, // 本地测试需要替换写死, 上线前切记恢复自动获取
                    source: /MicroMessenger/.test(window.navigator.userAgent)? 2:7,
                    customer_invitation: dct_code,
                }
                if($("#basic").val() && $("#basic").val() !== 'A'){
                    if($(".specialityBox").is(':visible')){
                        formData['data[paper_type][label]'] = '论文类型'
                        formData['data[paper_type][value]'] = configs[$("#basic").val()]
                    }
                }
                formData['data[title][label]'] = '论文标题'
                formData['data[title][value]'] = $('#contenteditable').val()
                formData['data[file_path][label]'] = '文件地址';
                formData['data[file_path][value]'] =  res.data.path;
                var form_data = getFormData(formData)
                unifiedCreate(form_data)
            }else{
                throttling = true
                if(res.codeMsg){
                    toast({
                        msg: res.codeMsg,
                        type: 'error',
                        time: 2000
                    })
                }else{
                    toast({
                        msg: '论文提交失败，请重试',
                        type: 'error',
                        time: 2000
                    })
                }
            }
        },
        error: function() {
            throttling = true
            toast({
                msg: '论文提交失败，请重试',
                type: 'error',
                time: 2000
            })
        }
    })
}

if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){  // ios css处理
    $(".more-Fbtn-s p").css('margin-top', '0.2rem')
    $(".more-Fbtn-h p").css('margin-top', '0.2rem')
}

$(".more-Fbtn-s").on('click', function (){
    $(".more-Fbtn-s").hide()
    $(".more-Fbtn-h").show()
    $(".activity_block").css('top', 'calc(75% - 21.6rem)')
    $(".extension").css('top', 'calc(75% - 16.2rem)')
    $(".fixed-problem").css({'top':'calc(75% - 5.4rem)', 'box-shadow':'0rem 0rem 2rem 0rem rgba(0, 0, 0, 0.09)'})
    $(".customer-wx").css({'top':'calc(75% - 10.8rem)', 'box-shadow':'0rem 0rem 2rem 0rem rgba(0, 0, 0, 0.09)'})
})

$(".more-Fbtn-h").on('click', function (){
    $(".more-Fbtn-h").hide()
    $(".more-Fbtn-s").show()
    $(".activity_block").css('top', 'calc(75% - 10.8rem)')
    $(".extension").css('top', 'calc(75% - 5.4rem)')
    $(".fixed-problem").css({'top':'75%','box-shadow':'none'})
    $(".customer-wx").css({'top':'75%','box-shadow':'none'})
})

$(".upk_close").on('click', function (){
    $(".proposal-check").attr('checked', false)
    $(".proposal-check").trigger('change')
    $(".upk_mask").hide()
    $(".uploadKTBG_pop").slideUp()

})

$(".uploadKTBG_pop .upk_btn").on('click', function (){
    $("#uploadFile").click()
})

// sci 润色 部分
function countWords(str) {
    // 使用正则表达式匹配所有单词，\b 表示单词边界
    const words = str.match(/\b\w+\b/g);
    return words ? words.length : 0;
}

$("#sci_original").on('input', function (){
    if($(this).val()){
        $(this).val($(this).val().replace(/[\u4e00-\u9fa5]/g, ''))
    }
    $(".sci_wordCount .sci_word").text(countWords($(this).val()))
})

function upload_sci(){
    if(!$("#sci_original").val()){
        toast('请输入或粘贴内容')
        return
    }
    toast({
        msg: '正在提交,请稍后...',
        type: 'loading',
        time: 20000
    })
    throttling = false
    var formdata = new FormData()
    formdata.append('content', $("#sci_original").val())
    formdata.append('type', typeData[$('#type_s').val()].short_name)
    $.ajax({
        type: 'POST',
        url: urls + '/api/project/ai_paper_report/pre_handle/file_upload',
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        data: formdata,
        success: function (res) {
            if(res.code == 200){
                var formData = {
                    goods_id: $("#type_s").val(),
                    domain_record: window.location.origin,
                    source: 1,
                    customer_invitation: dct_code,
                }
                formData['data[file_path][label]'] = '文件地址'
                formData['data[file_path][value]'] = res.data.path
                unifiedCreate(getFormData(formData))
            }else{
                if(res.codeMsg){
                    cocoMessage.error(res.codeMsg, 3000);
                }else{
                    cocoMessage.error('论文提交失败，请重试', 3000);
                }
            }
        },
        error: function (){
            cocoMessage.error('论文提交失败，请重试', 3000);
        }
    })
}

// 默认参考文献数量显示
var  defaultReferences_num = 20
function change_defaultReferences() {
    if($('#NumberWords').val()<=6000) {
        defaultReferences_num = 20
    }
    if($('#NumberWords').val()>6000 && $('#NumberWords').val()<=20000) {
        defaultReferences_num = 25
    }
    if($('#NumberWords').val()>20000) {
        defaultReferences_num = Math.ceil($('#NumberWords').val()/10000*10) + 5
    }
    if($("input[name='reportType']:checked").val() == 'ss'){
        defaultReferences_num += 5
    }
    $(".defaultReferences_num").text(defaultReferences_num + '篇')
    if(defaultReferences_num > 200) {
        $(".defaultReferences_num").text('全部为')
    }
}