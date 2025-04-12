var ktbgProfessional = []; // 开题报告专业版数据(后端用)
var previewData = []; // 开题报告专业版数据(前端用)
var Radius = [5000 , 50000]
var title_record = {}  // 各商品已填写标题
$('#keyword').manifest();

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
    "H":"护理学",
}

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

$('#type_s , #type_s2').change(function() {
    changeType($(this))
})
function changeType(this_ , this_val) {
    var val = this_.val() || this_val
    $(".version-wxzs .version-wxzs-err").hide()
    $(".selectPeriodical .periodical-err").hide();
    $(".literatureNum .literatureNum-err").hide();
    // 标题处理
    if(typeData[val].short_name == 'xzaigccheck' || typeData[val].short_name == 'zjcaigc'){
        if(title_record[val]){
            $("#contenteditable4").val(title_record[val])
        }else{
            $("#contenteditable4").val('')
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
    var permit_name = ['rws' , 'ktbg' ,'ktbgsenior' , 'wxzs' , 'kclw' , 'zjcaigc' , 'dybg', 'lwdbppt' , 'xzaigccheck']
    var this_short_name = typeData[val].short_name
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
        $('.minNumber').text(Radius[0])
        $('.maxNumber').text(Radius[1])

        $('.NumberIsShow').show()
        $(".version-wxzs").hide()
        // $('.editTitle>.title').text(typeData[val].name)
    }
    if(this_short_name !== 'bylw' && this_short_name !== 'qklw' && this_short_name !== 'bylwsenior' && this_short_name !== 'qklwsenior'&& this_short_name !== 'kclw'){    //图表
        $('.gen_params').hide()
    }else{
        $('.gen_params').show()
        $('.genCode').show()
        $('.Sample_Chart').show()
        $('.Sample_Chart1').hide()
        if(this_short_name =='kclw'){
            $('.genCode').hide()
            $('.Sample_Chart1').show()
            $('.Sample_Chart').hide()
        }
    }
    if(this_short_name !== 'bylw' && this_short_name !== 'bylwsenior' && this_short_name !== 'ktbg' && this_short_name !== 'ktbgsenior' && this_short_name !== 'kclw' && this_short_name !== 'qklw' && this_short_name !== 'qklwsenior'){ // 参考文献
        $('.EnglishLiterature').hide()
    }else {
        if(this_short_name == 'bylw' || this_short_name == 'bylwsenior' || this_short_name == 'qklw' || this_short_name == 'qklwsenior'){
            if(!$(".proposal-check").is(':checked')){
                $('.EnglishLiterature').show()
                $('#NumberWords').trigger('input')
                $("input[name='LiteratureType']").trigger('change')
            }
        }else{
            $('.EnglishLiterature').show()
            $('.EnglishReference').removeAttr('disabled');
            $('.EnglishLiteratureBox').removeClass('Prohibited')
        }
    }

    if(this_short_name == 'kclw'){    // 课程论文
        $('.EducationalAltitude').show()
    }else {
        $('.EducationalAltitude').hide()
    }

    // 写作辅助的可配置参数
    if(this_short_name == 'bylw' || this_short_name == 'bylwsenior' || this_short_name == 'qklwsenior' || this_short_name == 'kclw' || this_short_name == 'ktbg' || this_short_name == 'ktbgsenior' || this_short_name == 'qklw'){
        if(parameterSet[this_short_name] && parameterSet[this_short_name].submit_attribute) {
            if(parameterSet[this_short_name].submit_attribute.value.education && parameterSet[this_short_name].submit_attribute.value.education.value){
                $(".education_c").show()
            }else {
                $(".education_c").hide()
            }
            if(parameterSet[this_short_name].submit_attribute.value.keyword && parameterSet[this_short_name].submit_attribute.value.keyword.value){
                $(".keywordBox").show()
            }else {
                $(".keywordBox").hide()
            }
            if(parameterSet[this_short_name].submit_attribute.value.major && parameterSet[this_short_name].submit_attribute.value.major.value){
                $(".major").show()
            }else {
                $(".major").hide()
            }
            if(parameterSet[this_short_name].submit_attribute.value.reference_content && parameterSet[this_short_name].submit_attribute.value.reference_content.value) {
                $(".supplement").show()
            }else{
                $(".supplement").hide()
            }
    
            if(parameterSet[this_short_name].submit_attribute.value.references_en_num && parameterSet[this_short_name].submit_attribute.value.references_en_num.value) {
                $(".EnglishLiterature").removeClass('displayHide')
            }else{
                $(".EnglishLiterature").addClass('displayHide')
            }
            
            if(this_short_name !== 'qklwsenior'){
                $(".proposal-check").trigger('change')
            }
        }
    }else{
        $(".education_c").hide()
        $(".major").hide()
        $(".keywordBox").hide()
        $(".supplement").hide()
        $(".EnglishLiterature").addClass('displayHide')
    }

    if(['ktbgsenior' , 'ktbg' , 'bylw' , 'bylwsenior', 'qklw', 'qklwsenior'].includes(this_short_name)){
        $(".Toggle2").show();
    }else {
        $(".Toggle2").hide();
    }

    if(this_short_name == 'dybg' || this_short_name == 'ktbg'||this_short_name=='rws') {
        $(".education_c").show()
    }

    if(this_short_name == 'bylw' || this_short_name == 'bylwsenior'){
        $(".proposal").show()
    }else{
        $(".proposal").hide()
    }

    // 开题报告专业版
    if(this_short_name == 'ktbgsenior'){
        $('.selectDegree').show()
    }else {
        $('.selectDegree').hide()
    }

    // 开题报告专业版
    if(this_short_name == 'qklwsenior'){
        $('.selectPeriodical').show()
        $('.literatureNum').show()
    }else {
        $('.selectPeriodical').hide()
        $('.literatureNum').hide()
    }

    if(this_short_name == 'sxbg') {
        $(".major_sxbg").show()
    }else {
        $(".major_sxbg").hide()
    }

    if(this_short_name == 'zjcaigc') { // 降aigc特殊处理
        editionType(this_short_name)
        file_path = ''
        if($("#ThesisInput").val()){
            $(".deleteFileThesis").click()
        }
        $('.jiangAIGCContent').show()
    }else {
        editionType(this_short_name)
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

    if(this_short_name == 'lwdbppt') {
        $(".major").show()
        file_path = ''
        if($("#ThesisInput").val()){
            $(".deleteFileThesis").click()
        }
        $(".jiangAIGCContent").show()
    }

    // 清空报错提示
    $("#ContainerTo").data('bootstrapValidator').resetForm();
}
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

$(".keywordP").on('click',function (){
    $("#keyword").focus()
})

$("#keyword").on('blur',function (){
    setTimeout(function () {
        if($("#mf_keyword_list li").length == 0) {
            $(".keywordP").show()
        }
    },50)
})

$("#keyword").on('input',function (){
    if($(this).val()){
        $(".keywordP").hide()
    }
})

// 选项input
var education = 'bk';
$(".toCheck").on('click',function (){
    $(this).find(".EnglishReference , .education_i , .SubmissionMode , .FamilyCategory").click()
})

$(".EnglishReference , .education_i , .SubmissionMode , .FamilyCategory").on('click',function (event){
    event.stopPropagation()
})

// 生成图片和表格
$(".genImg").on('click',function (){
    $(this).find('input').click()
})

$(".genTab").on('click',function (){
    $(this).find('input').click()
})

$(".genFormula").on('click',function (){
    $(this).find('input').click()
})

$(".genCode").on('click',function (){
    $(this).find('input').click()
})

$(".gen_params input[type=checkbox]").on('click',function (event){
    event.stopPropagation()
})

// 控制字数和按钮的交互
$(".FruitBox").on('click','input',function(){
    $('.labelTitle').removeClass('selected')
    $('.' + $(this).val()).addClass('selected')
    $('#NumberWords').val($(this).val())
    NumberChange($(this).val())
    // 清空报错提示
    $("#ContainerTo").data('bootstrapValidator').resetForm();
});
$('#NumberWords').keyup(function() {
    $('.labelTitle').removeClass('selected')
})

// 期刊论文专业版  期刊类型   文献数量
$(".periodicalType").on('click', function (){
    $(".periodicalType").removeClass('select')
    $(this).addClass('select')
    $(".selectPeriodical .periodical-err").hide();
})

$(".l-numB").on('click', function (){
    $(".l-numB").removeClass('select')
    $(this).addClass('select')
    $(".literatureNum .literatureNum-err").hide();
})


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
        contenteditable4: {
            container: "#contenteditable4_err",
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
                    callback: function (value, validator, $field) {
                        if(value>=Radius[0] && value<=Radius[1]) {
                            return true
                        }else {
                            return { valid : false, message: '字数区间为'+Radius[0]+'至'+Radius[1]+''}
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
        },
    }
});
var throttling = true;
if(getQueryVariable('qhclickid')) {
    window.localStorage.setItem('qhclickid',getQueryVariable('qhclickid'))
}
if(getQueryVariable('bd_vid')) {
    window.localStorage.setItem('bd_vid',window.location.href)
}
$('.generate').click(function() {
    // is强制登录拦截
    if(memberFu.interceptLogin && memberFu.interceptLogin()) return false;


    // 专业版提交
    if($('#App').hasClass('ProfessionalEdition')) return professionalSubmitted();

    // 极速版提交
    if(!$('#type_s').val()){
        return;
    }
    if(!$('.inputCheck').prop("checked")) return cocoMessage.error('请确认知晓并同意 "生成的论文范文仅用于参考,不作为毕业、发表使用" 条款!', 3000)
    if(typeData[$('#type_s').val()].short_name == 'wxzs' && $(".version-wxzs2").attr('data-goodsid')) {
        if(!$(".version-item.active").attr('data-goodsid')){
            $(".version-wxzs .version-wxzs-err").show()
        }
    }
    var bootstrapValidator = $("#ContainerTo").data("bootstrapValidator").validate();
    if (bootstrapValidator.isValid()) {
        if(!throttling) return
        if(typeData[$('#type_s').val()].short_name == 'lwdbppt' && $("input[name='upload_type']:checked").val()==1){
            upload_lwdbppt()
            return
        }

        // 判断关键词
        var keyWord = ''
        if($("#mf_keyword_list li").length > 8 || ($("#mf_keyword_list li").length < 3 && $("#mf_keyword_list li").length > 0)){
            $("#keyword_err").show()
            $(".mf_container").addClass('errorBorder')
            $(".keywordBox .contenteditable_s").addClass('has-error')
            return
        }else{
            $("#keyword_err").hide()
            $(".mf_container").removeClass('errorBorder')
            $(".keywordBox .contenteditable_s").removeClass('has-error')
            $("#mf_keyword_list li").each(function () {
                keyWord += $(this).find('input').val()+'；'
            })
            if(keyWord.lastIndexOf('；') == (keyWord.length-1)){
                keyWord = keyWord.slice(0,keyWord.lastIndexOf('；'))
            }
        }

        // 自写开题报告
        if( typeData[$('#type_s').val()].short_name=='bylw' && $(".proposal-check").is(':checked') && !fid && !ktbg_generate){
            $(".proposal-err").show()
            return ;
        }
        if(!$(".proposal-check").is(':checked')){
            $(".proposal-err").hide()
        }

        throttling = false
        var formData = {
            goods_id: $("#type_s").val(),
            domain_record: window.location.origin,
            source: 1,
            customer_invitation: dct_code,
        }
        if(typeData[$('#type_s').val()].short_name == 'wxzs' && $(".version-wxzs2").attr('data-goodsid')) {
            if(!$(".version-item.active").attr('data-goodsid')){
                $(".version-wxzs .version-wxzs-err").show()
                throttling = true
                return;
            }else{
                formData.goods_id = $(".version-item.active").attr('data-goodsid')
            }
        }
        if(typeData[$('#type_s').val()].short_name == 'bylw' && $("#basic").val() && $("#basic").val() !== 'A'){
            if($(".major").is(':visible')){
                formData['data[paper_type][label]'] = '论文类型'
                formData['data[paper_type][value]'] = configs[$("#basic").val()]
            }
        }
        if(typeData[$('#type_s').val()].short_name == 'bylw' || typeData[$('#type_s').val()].short_name == 'qklw' ||typeData[$('#type_s').val()].short_name == 'kclw') {
            formData['data[gen_tab][label]'] = '生成表格'
            formData['data[gen_tab][value]'] = $(".gen_tab").is(':checked')?1:0
            formData['data[gen_img][label]'] = '生成图片'
            formData['data[gen_img][value]'] =  $(".gen_img").is(':checked')?1:0
            formData['data[gen_formula][label]'] = '生成公式'
            formData['data[gen_formula][value]'] =  $(".gen_formula").is(':checked')?1:0
            formData['data[gen_code][label]'] = '生成代码'
            formData['data[gen_code][value]'] =  $(".gen_code").is(':checked')?1:0
            if($(".education_c").is(':visible') && typeData[$('#type_s').val()].short_name == 'bylw'){
                formData['data[education][label]'] = '学历'
                formData['data[education][value]'] = $("input[name='reportType']:checked").val();
            }
            if($(".keywordBox").is(':visible') && typeData[$('#type_s').val()].short_name == 'bylw'){
                formData['data[keyword][label]'] = '关键词'
                formData['data[keyword][value]'] = keyWord
            }
        }

        // 英文参考
        if(typeData[$('#type_s').val()].short_name == 'bylw' && !$(".proposal-check").is(':checked')) {
            // 判断英文参考文献
            if(!LiteratureFU()) {
                throttling = true
                return
            }
            var LiteratureType = $('input:checkbox[name="LiteratureType"]').is(':checked');
            formData['data[references_en_num][label]'] = '英文参考文献数量'
            if(LiteratureType) {
                formData['data[references_en_num][value]'] = $('#NumberEnglishReference').val()
            }else{
                formData['data[references_en_num][value]'] = 0
            }
        }
        if(typeData[$('#type_s').val()].short_name == 'ktbg' || typeData[$('#type_s').val()].short_name == 'kclw' || typeData[$('#type_s').val()].short_name == 'qklw') {
            // 判断英文参考文献
            if(!LiteratureFU()) {
                throttling = true
                return
            }
            var LiteratureType = $('input:checkbox[name="LiteratureType"]').is(':checked');
            formData['data[references_en_num][label]'] = '英文参考文献数量'
            if(LiteratureType) {
                formData['data[references_en_num][value]'] = $('#NumberEnglishReference').val()
            }else{
                formData['data[references_en_num][value]'] = 0
            }
        }

        var noNumberWords = ['rws' , 'ktbg' , 'wxzs' , 'zjcaigc' , 'dybg' , 'lwdbppt' , 'xzaigccheck']
        if(noNumberWords.indexOf(typeData[$('#type_s').val()].short_name) == -1) {
            formData['data[word_num][label]'] = '生成字数'
            if(typeData[$('#type_s').val()].short_name == 'kclw') {
                formData['data[word_num][value]'] = $(".EducationalAltitude .cardSelect").attr('data-key');
                formData['data[education][label]'] = '学历';
                formData['data[education][value]'] = $(".EducationalAltitude .cardSelect").attr('data-education');
            }else {
                formData['data[word_num][value]'] = $("#NumberWords").val()
            }
        }

        //调研报告
        if(typeData[$('#type_s').val()].short_name == 'dybg'){
            formData['data[education][label]'] = '学历'
            formData['data[education][value]'] = $("input[name='reportType']:checked").val();
        }
        //任务书
        if(typeData[$('#type_s').val()].short_name == 'rws'){
            formData['data[education][label]'] = '学历'
            formData['data[education][value]'] = $("input[name='reportType']:checked").val();
        }

        // 自写开题报告
        if($(".proposal-check").is(':checked') && typeData[$('#type_s').val()].short_name == 'bylw'){
            if(fid){
                formData['data[gen_ktbg][label]'] = '开题报告';
                formData['data[gen_ktbg][value]'] = $(".proposal-check").is(':checked')?1:0;
                formData['data[fid][label]'] = '文件标识';
                formData['data[fid][value]'] = fid;
            }
            if(ktbg_generate){
                formData['order_sn'] = ktbg_generate
            }
        }

        // 答辩PPT
        if(typeData[$('#type_s').val()].short_name == 'lwdbppt'){
            formData['data[file_path][label]'] = '文件地址'
            formData['data[file_path][value]'] = file_path;
            if($("#basic").val() !== 'A'){
                formData['data[paper_type][label]'] = '论文类型'
                formData['data[paper_type][value]'] = configs[$("#basic").val()]
            }
        }

        if(window.localStorage.getItem('qhclickid')) {
            formData['qhclickid'] =  window.localStorage.getItem('qhclickid')
        }
        if(window.localStorage.getItem('bd_vid')) {
            formData['bd_vid'] =  window.localStorage.getItem('bd_vid')
        }

        formData['data[title][label]'] = '论文标题'
        // 降aigc
        if(typeData[$('#type_s').val()].short_name == 'zjcaigc') {
            // formData['data[paper_type][label]'] = '论文类型';
            // formData['data[paper_type][value]'] = $("input[name='paper_type']:checked").val();
            formData['upload_type'] = $("input[name='upload_type']:checked").val();
            if($("input[name='upload_type']:checked").val() == 1) {
                formData['content'] = $('#textareaText').val();
            }else {
                formData['data[file_path][label]'] = '文件地址';
                formData['data[file_path][value]'] = file_path;
            }
            formData['data[title][value]'] = $('#contenteditable4').val()
        }else {
            formData['data[title][value]'] = $('#contenteditable').val()
        }

        // 查aigc
        if(typeData[$('#type_s').val()].short_name == 'xzaigccheck') {            
            formData['data[author][label]'] = '论文作者'
            formData['data[author][value]'] = $('#author').val()
            formData['upload_type'] = $("input[name='upload_type']:checked").val();
            if($("input[name='upload_type']:checked").val() == 1) {
                formData['content'] = $('#textareaText').val();
            }else {
                formData['data[file_path][label]'] = '文件地址';
                formData['data[file_path][value]'] = file_path;
            }
            formData['data[title][value]'] = $('#contenteditable4').val()
        }

        // 实践报告
        if(typeData[$('#type_s').val()].short_name == 'sxbg' && SPECIALITY[$("#basic2").val()]!='其他（自动识别）') {
            formData['data[paper_type][label]'] = '论文类型';
            formData['data[paper_type][value]'] = SPECIALITY[$("#basic2").val()]
        }
        // 开题报告(极速版)
        if(typeData[$('#type_s').val()].short_name == 'ktbg'){
            formData['data[education][label]'] = '学历'
            formData['data[education][value]'] = $("input[name='reportType']:checked").val();
        }
        var form_data = getFormData(formData)
        unifiedCreate(form_data,$("#type_s").val())
    }
})

function professionalSubmitted() { // 开题报告专业版参数
    var bootstrapValidator = $("#ContainerTo").data("bootstrapValidator").validate();
    if (bootstrapValidator.isValid()) {
        if(!throttling) return
        var formData = {
            goods_id: $("#type_s2").val(),
            domain_record: window.location.origin,
            source: 1,
            customer_invitation: dct_code,
        }
        formData['data[title][label]'] = '论文标题'
        formData['data[title][value]'] = $('#contenteditable').val()
        var ckwx = false
        if(typeData[$('#type_s2').val()].short_name == 'ktbgsenior') { // 开题报告专业版
            formData['data[education][label]'] = '学历'
            formData['data[education][value]'] = $(".selectDegree .cardSelect").data('education')
            // 英文参考
            var LiteratureType =$('input:checkbox[name="LiteratureType"]').is(':checked');
            formData['data[references_en_num][label]'] = '英文参考文献数量'
            if(LiteratureType) {
                formData['data[references_en_num][value]'] = $('#NumberEnglishReference').val()
            }else {
                formData['data[references_en_num][value]'] = 0
            }
            if(ktbgProfessional.length) {
                formData['data[outlines][label]'] = '提纲'
                for(var kt=0; kt<ktbgProfessional.length; kt++) {
                    formData['data[outlines][value]['+kt+']'] = ktbgProfessional[kt]

                    // 判断是否选择了参考文献ckwx为true说明存在
                    if(!ckwx && ktbgProfessional[kt].indexOf('参考文献')!=-1) {
                        ckwx = true
                    }
                }
            }else {
                return cocoMessage.error("请编辑自定义提纲!", 2000);
            }
        }
        
        // 当参考文献未选择, 且选择了英文参考文献,自动补参考文献
        if(!ckwx && $('#NumberEnglishReference').val()) {
            var dataHierarchy = Number($('.aidashi.previewOutline').last().attr('data-hierarchy')) + 1;
            formData['data[outlines][value]['+ktbgProfessional.length+']'] = dataHierarchy+'. 参考文献'
        }
        var form_data = getFormData(formData)
        unifiedCreate(form_data , $("#type_s2").val() , previewData)
    }
}
function unifiedCreate(form_data, goods_id , outline) {
    var hasKtbg = fid?(!!fid):ktbg_generate
    var closeMsg = cocoMessage.loading('正在提交,请稍后...');
    $.ajax({
        type: 'post',
        url: urls + '/api/client/order/unified/create?user_token='+ USER_TOKEN + '&jane_name='+ JANE_NAME+(suffix?'&'+suffix:'') + (suffix2?'&'+suffix2:''),
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        },
        data: form_data,
        success: function(data) {
            if (data.code == 200) {
                localStorage.setItem('reviewData', (outline? JSON.stringify(outline) : ''))
                throttling = true
                closeMsg();
                location.href = './pay.html?order_sn=' + data.data.order_sn + '&contentType=' + form_data.get('goods_id') + '&zxktbg=' + hasKtbg;
            } else {
                throttling = true
                closeMsg();
                cocoMessage.error(data.codeMsg, 3000);
            }
        },
        error: function(err) {
            throttling = true
            closeMsg();
            cocoMessage.error("请求失败!请检查网络", 2000);
        }
    });
}


!function(){ // 生成随机轮播图
    var x = 35;
    var y = 0;
    var rand = parseInt(Math.random()*(x-y+1)+y);
    function rand2() {
        var x = 35;
        var y = 0;
        var rand = sex[parseInt(Math.random()*(x-y+1)+y)];
        return rand || '交互式'
    }
    function time() {
        var x = 15;
        var y = 1;
        var rand = parseInt(Math.random()*(x-y+1)+y);
        return rand
    }
    for(var i=0; i<20; i++) {
        var text = "";
        text += "							<li><a href=\"#\">";
        text += "								<div class=\"\">"+time()+"分钟前论文《"+rand2()+"**********》生成成功</span></div>";
        text += "							</a></li>";
        $('.news_li').append(text)
    }

}()

$("#contenteditable").bind("input propertychange", function(){
    $('.numberS').text($(this).val().length)
    if($("#App").hasClass('bylwsenior') || $("#App").hasClass('ktbgsenior') || $("#App").hasClass('qklwsenior')){
        title_record[$("#type_s2").val()] = $(this).val()
    }else{
        title_record[$("#type_s").val()] = $(this).val()
    }
});
$("#contenteditable4").bind("input propertychange", function(){
    $('.numberS2').text($(this).val().length)
    title_record[$("#type_s").val()] = $(this).val()
});
$("#contenteditable3").bind("input propertychange", function(){
    $('#editQuantity .numberS').text($(this).val().length)
    title_record[$("#type_s").val()] = $(this).val()
});

$('#basic').on('hidden.bs.select', function(e) {
    var tmpSelected = $('#basic').val();
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

function b(){	// 首页新闻滚动
    t = parseInt(x.css('top'));
    y.css('top','30px');
    x.animate({top: t - 30 + 'px'},'slow');	//30为每个li的高度
    if(Math.abs(t) == h-30){ //30为每个li的高度
        y.animate({top:'0px'},'slow');
        z=x;
        x=y;
        y=z;
    }
    setTimeout(b,3000);//滚动间隔时间 现在是3秒
}

$(document).ready(function(){
    $('.swap').html($('.news_li').html());
    x = $('.news_li');
    y = $('.swap');
    h = $('.news_li li').length * 30; //30为每个li的高度
    setTimeout(b,3000);//滚动间隔时间 现在是3秒
})

$('.query').click(function() {
    location.href = './query.html'
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

$(".version-item").on('click',function (){
    $(".version-item").removeClass('active')
    $(".version-wxzs .version-wxzs-err").hide()
    $(this).addClass('active')
})

// 补充说明
$("#illustrate").on('input',function (){
    $(".illustrate-number").text( $("#illustrate").val().length )
})

$("#illustrate").on('focus',function (){
    $("#illustrate").css('height', '180px')
})

$("#illustrate").on('blur',function (){
    if( !$("#illustrate").val().length ) {
        $(".professional textarea").css('height', '40px')
    }

    if($("#illustrate").val().length >= 200) {
        $(".professional").css('borderColor', '#eee')
        $(".professional-err").hide()
    }
})

// 学历选择
$(".substance").on('click',function (){
    $(".cardSelect").removeClass('cardSelect')
    $(this).addClass('cardSelect')
})

//自写开题报告
var fid = ''
$(".proposal-text").on('click',function (){
    $('.openingReport , .mask_body').show()
    $('.proposal-check').prop('checked', true).change();
})
$('.close_pop').click(function() {
    $('.openingReport , .mask_body').hide()
    $('.proposal-check').prop('checked', false).change();
})
$('.determine_package').click(function() {
    $('.uploadBox').click()
})
$('.switchingZYB').click(function() {
    $(".Toggle2").click()
    $('.openingReport , .mask_body').hide()
})

$(".proposal-check").on('click',function (event){
    event.stopPropagation()
})

$(".uploadBox").on('click',function (){
    $('#uploadFile-ktbg').click()
})

$(".proposal-check").on('change',function (){
    if($(this).is(':checked')){
        $(".uploadBox").show()
        $(".uploadTips").css('display',' inline-block')
        $(".EnglishLiterature").hide()
    }else{
        $(".uploadBox").hide()
        $(".uploadTips").hide()
        $(".EnglishLiterature").show()
    }
})

// 上传开题报告
$("#uploadFile-ktbg").on('change',function (){
    if($(this)[0].files[0]){
        $(".uploadBlock").hide();
        $(".fileBlock").show();
        $(".file-uploading").show();
        $(".proposal-err").hide()
        $(".fileName").text($(this)[0].files[0].name);
        $('.determine_package').addClass('loading')
        var formdata = new FormData()
        formdata.append('file', $("#uploadFile-ktbg")[0].files[0])
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
                $('.determine_package').removeClass('loading')
                if(res.code == 200){
                    $(".file-uploading").hide();
                    $(".file-uploadSuc").css('display','inline-block');
                    fid = res.data.fid
                    $('.proposal-check').prop('checked', true);
                    $('.openingReport , .mask_body').hide()
                }else{
                    if(res.codeMsg){
                        cocoMessage.error(res.codeMsg, 3000);
                    }else{
                        cocoMessage.error('文件上传失败，请重试', 3000);
                    }
                    $(".fileName").addClass('hasError')
                    $(".file-uploading").hide();
                    $(".file-uploadErr").show();
                    // 开题报告删除失败, 保持勾选上
                    deleteFileFU('KTfailure')
                }
            },
            error: function(err) {
                cocoMessage.error('文件上传失败，请重试', 3000);
                $(".fileName").addClass('hasError')
                $(".file-uploading").hide();
                $(".file-uploadErr").show();
                deleteFileFU('KTfailure')
            }
        })
    }else{
        $('.determine_package').removeClass('loading')
        $(".uploadBlock").show();
        $(".fileBlock").hide();
        $(".fileName").text('');
    }
})

$(".deleteFile").on('click',function (){
    deleteFileFU()
})
function deleteFileFU(type) {
    if(type == 'Toggle' && ktbg_generate) return
    setTimeout(function() {
        $("#uploadFile-ktbg").val('')
        $(".file-uploading").hide();
        $(".file-uploadErr").hide();
        $(".file-uploadSuc").hide();
        $(".fileBlock").removeClass('active')
        $(".fileName").removeClass('hasError');
        $("#uploadFile-ktbg").trigger('change');
        fid = '';
        ktbg_generate = false;
        var checked = (type=='KTfailure'? true : false)
        $('.proposal-check').prop('checked', checked).change();
    },0)
}

// 开题报告生成论文
var ktbg_generate = false
if(getQueryVariable('ktbg')){
    ktbg_generate = getQueryVariable('ktbg')
}
function ktbgGenerate() {
    if(getQueryVariable('ktbg')) {
        var bylw = '';
        for(key in typeData){
            if(typeData[key].short_name == 'bylw'){
                bylw = key
            }
        }
        if($(".Toggle2").attr('edition-key') == 'bylw'){
            // $(".Toggle2").click()
            if($('#type_s').val() !== bylw){
                setTimeout(function (){
                    $('#type_s').val(bylw)
                    $("#type_s").trigger('change')
                    $('#contenteditable').val(getQueryVariable('title'))
                    $('.numberS').text(getQueryVariable('title').length)
                    $("#contenteditable").trigger('input')
                    $(".proposal-check").click()
                    $(".proposal-check").trigger('change')
                    $(".uploadBlock").hide()
                    $(".fileName").text(getQueryVariable('title') + '-开题报告.docx')
                    $(".fileBlock").addClass('active')
                    $(".fileBlock").show()
                },0)
            }
            if($('#type_s').val() == bylw){
                $('#contenteditable').val(getQueryVariable('title'))
                $('.numberS').text(getQueryVariable('title').length)
                $(".proposal-check").click()
                $(".proposal-check").trigger('change')
                $(".uploadBlock").hide()
                $(".fileName").text(getQueryVariable('title') + '-开题报告.docx')
                $(".fileBlock").addClass('active')
                $(".fileBlock").show()
            }
        }
        if($(".Toggle2").attr('edition-key') == 'bylwsenior'){
            if($('#type_s').val() !== bylw){
                setTimeout(function (){
                    $('#type_s').val(bylw)
                    $("#type_s").trigger('change')
                    $('#contenteditable').val(getQueryVariable('title'))
                    $('.numberS').text(getQueryVariable('title').length)
                    $("#contenteditable").trigger('input')
                    $(".proposal-check").click()
                    $(".proposal-check").trigger('change')
                    $(".uploadBlock").hide()
                    $(".fileName").text(getQueryVariable('title') + '-开题报告.docx')
                    $(".fileBlock").addClass('active')
                    $(".fileBlock").show()
                },0)
            }
            if($('#type_s').val() == bylw){
                $('#contenteditable').val(getQueryVariable('title'))
                $('.numberS').text(getQueryVariable('title').length)
                $(".proposal-check").click()
                $(".proposal-check").trigger('change')
                $(".uploadBlock").hide()
                $(".fileName").text(getQueryVariable('title') + '-开题报告.docx')
                $(".fileBlock").addClass('active')
                $(".fileBlock").show()
            }
        }
    }
}

// 早降重 - 降aigc率   答辩PPT复用提交
var file_path = ''
$("#ThesisInput").on('change',function (){
    if($(this)[0].files[0]){
        $('.Not , .UploadedSuccess , .UploadFailed').hide()
        $('.Complete , .Loading , .lodingGif').show()
        var fileName = $("#ThesisInput")[0].files[0].name
        $(".fileNameThesis").text(fileName);
        var formdata = new FormData()
        formdata.append('file', $("#ThesisInput")[0].files[0])
        formdata.append('type', typeData[$("#type_s").val()].short_name)
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
                        cocoMessage.error(res.codeMsg, 3000);
                    }else{
                        cocoMessage.error('文件上传失败，请重试', 3000);
                    }
                }
                fileNameImgType(fileName)
            },
            error: function() {
                UploadFailed()
                fileNameImgType(fileName)
                cocoMessage.error('文件上传失败，请重试', 3000);
            }
        })
    }else{
        UploadFailed()
    }
})

$("#ThesisInput").on('mouseenter', function (){
    $(".Thesis").addClass('uploading')
})

$("#ThesisInput").on('mouseleave', function (){
    $(".Thesis").removeClass('uploading')
})

$("#textareaText").on('focus', function (){
    $(".Thesis").addClass('editing')
})

$("#textareaText").on('blur', function (){
    $(".Thesis").removeClass('editing')
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
$('.SubmissionMode').on('change',function (){
    $("#ContainerTo").data('bootstrapValidator').resetForm();
    showType($(this).val())
})
function showType(val) {
    if(val == 1) {
        $('.InputBox').show()
        $('.UploadBox').hide()
    }else {
        $('.InputBox').hide()
        $('.UploadBox').show()
    }
}
setTimeout(function() {
    showType($('.SubmissionMode:checked').val())
} , 500)

// 英文参考逻辑
$("input[name='LiteratureType']").change(function() {
    if($(this).is(':checked')){
        $('.inputQuantity').css('display' , 'inline-block')
    }else{
        $('.inputQuantity').hide()
        $("#LiteratureType_err").hide()
        $(".inputQuantity .form-control").removeClass('errorBorder')
    }
})

$('#NumberEnglishReference').on('input', function() {
    LiteratureFU()
})

$('#NumberWords').on('input', function() {
    NumberChange($(this).val())
})
function NumberChange(this_) {
    LiteratureFU()
    if(this_) {
        $('.EnglishReference').removeAttr('disabled');
        $('.EnglishLiteratureBox').removeClass('Prohibited')
    }else {
        $("input[name='LiteratureType']").removeAttr('checked');
        $('.inputQuantity').hide()
        $('.EnglishLiteratureBox').addClass('Prohibited')
        $('.EnglishReference').attr('disabled','disabled');
    }
}
function upload_lwdbppt() {
    throttling = false
    var formdata = new FormData()
    formdata.append('content', $("#textareaText").val())
    formdata.append('type', typeData[$("#type_s").val()].short_name)
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
                // file_path = res.data.path
                var formData = {
                    goods_id: $("#type_s").val(),
                    domain_record: window.location.origin,
                    source: 1,
                    customer_invitation: dct_code,
                }
                formData['data[title][label]'] = '论文标题'
                formData['data[title][value]'] = $('#contenteditable').val()
                formData['data[file_path][label]'] = '文件地址'
                formData['data[file_path][value]'] = res.data.path;
                if($("#basic").val() !== 'A'){
                    formData['data[paper_type][label]'] = '论文类型'
                    formData['data[paper_type][value]'] = configs[$("#basic").val()]
                }
                unifiedCreate(getFormData(formData), $("#type_s").val())
            }else{
                throttling = true
                if(res.codeMsg){
                    cocoMessage.error(res.codeMsg, 3000);
                }else{
                    cocoMessage.error('论文提交失败，请重试', 3000);
                }
            }
        },
        error: function() {
            throttling = true
            cocoMessage.error('论文提交失败，请重试', 3000);
        }
    })
}
