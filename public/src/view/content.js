// CREATE
function mostraModalAddDivida()
{
    $("#modalAddDivida").modal('show')
}

function qtdParcelasAdd()
{
    switch ( $("#inptTipoDivida").val() )
    {
        case "servico":
            $("#containerQtdParcelas").hide()
            return '*'
        break;
        
        case "prestacao":
            $("#containerQtdParcelas").show()
            return $("#inptQuantidadeParcelas").val()
        break;
                
        case "avista":
            $("#containerQtdParcelas").hide()
            return 1
        break;
    }
}

function salvarDivida()
{
    let pago = ($("#inptPago").is(":checked")) ? 1 : 0;

    let obj = {
        "beneficiario":         $("#inptBeneficiario").val(),
        "dataEmissao":          formataDataUsBr($("#inptDataEmissao").val()),
        "dataPagamento":        formataDataUsBr($("#inptDataPagamento").val()),
        "dataVencimento":       formataDataUsBr($("#inptDataVencimento").val()),
        "descricao":            $("#inptDescricao").val(),
        "pago":                 pago,
        "quantidadeParcelas":   qtdParcelasAdd(),
        "tipoDivida":           $("#inptTipoDivida").val(),
        "valorAPagar":          $("#inptValorAPagar").val(),
        "valorPago":            $("#inptValor").val()
    }

    // validar o objeto a cima

    firebase.database()
        .ref('divida')
        .push(obj)
        .then( () => location.reload() )
        .catch( (err) => console.log("Erro: " + err) )
        .finally( () => location.reload() )
}
//RELOAD
function carregaDividas(mes, ano)
{
    showLoading()
    firebase.database()
        .ref('divida')
        .once('value')
        .then( 
            (snapshot) => {
                snapshot.forEach( item => {

                    preencheAnos(new Date(formataDataBrUs(item.val().dataVencimento)).getFullYear())

                    if ( new Date(formataDataBrUs(item.val().dataVencimento)).getFullYear() == ano
                        && new Date(formataDataBrUs(item.val().dataVencimento)).getMonth()+1 == mes )
                    {
                        $("#corpoTabela").html( ` ` )
                        montaLinha( item )
                        getValoresFooter( item )
                    }
            })
            
        })
        .catch( (err) => console.log(err) )
        .finally( () => hideLoading())
}

function montaLinha(item)
{
    $("#corpoTabela").append( `<tr>` )
    $("#corpoTabela").append( `<td id="${item.key}" style="display:none"> ${item.key} </td>` )
    $("#corpoTabela").append( `<td id="${item.key}_descricao">${item.val().descricao}</td>` )        
    $("#corpoTabela").append( `<td id="${item.key}_beneficiario">${item.val().beneficiario}</td>` )      
    $("#corpoTabela").append( `<td id="${item.key}_dataEmissao">${item.val().dataEmissao}</td>` )       
    $("#corpoTabela").append( `<td id="${item.key}_dataVencimento">${item.val().dataVencimento}</td>` )    
    $("#corpoTabela").append( `<td id="${item.key}_dataPagamento">${item.val().dataPagamento}</td>` )     
    $("#corpoTabela").append( `<td id="${item.key}_pago">${item.val().pago}</td>` )              
    $("#corpoTabela").append( `<td id="${item.key}_valorAPagar">${item.val().valorAPagar}</td>` )       
    $("#corpoTabela").append( `<td id="${item.key}_quantidadeParcelas">${item.val().quantidadeParcelas}</td>` )
    $("#corpoTabela").append( `<td id="${item.key}_valorPago">${item.val().valorPago}</td>` )
    $("#corpoTabela").append( `<td> <i class="bi bi-file-text"></i></td>` )
    $("#corpoTabela").append( `<td id="acao">
            <div>
            <button class="btn btn-warning btn-sm" title="Editar" onclick="mostraModalEditarivida('${item.key}')">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-danger btn-sm" title="Deletar" onclick="mostraModalDeletarDivida('${item.key}')" >
                <i class="bi bi-trash"></i>
            </button>
            <div>
        </td>` )
    $("#corpoTabela").append( "</tr>" )
}
// UPDATE
function mostraModalEditarivida(id)
{
    $("#idDivida").val(id)
    $("#modalEditDivida").modal('show')

    let dados = 
    {
        "beneficiario":         $(`#${id}_beneficiario`).html(),
        "dataEmissao":          formataDataBrUs($(`#${id}_dataEmissao`).html()),
        "dataPagamento":        formataDataBrUs($(`#${id}_dataPagamento`).html()),
        "dataVencimento":       formataDataBrUs($(`#${id}_dataVencimento`).html()),
        "descricao":            $(`#${id}_descricao`).html(),
        "pago":                 $(`#${id}_pago`).html(),
        "quantidadeParcelas":   qtdParcelasAdd(),
        "tipoDivida":           $("#inptEditTipoDivida").val(),
        "valorAPagar":          $(`#${id}_valorAPagar`).html(),
        "valorPago":            $(`#${id}_valorPago`).html() 
    }
    console.log(dados)
    //POPULA inpts
    $("#inptEditBeneficiario").val(dados.beneficiario)
    $("#inptEditDataEmissao").val(dados.dataEmissao)
    $("#inptEditDataPagamento").val(dados.dataPagamento)
    $("#inptEditDataVencimento").val(dados.dataVencimento)
    $("#inptEditDescricao").val(dados.descricao)
    $("#inptEditTipoDivida").val(dados.tipoDivida)
    $("#inptEditQuantidadeParcelas").val(dados.quantidadeParcelas)
    $("#inptEditValorAPagar").val(dados.valorAPagar)
    $("#inptEditValor").val(dados.valorPago)
    
    if (dados.pago == 1)
    {
        $("#inptEditPago").prop("checked", "true")
    }
    else
    {
        $("#inptEditPago").attr("checked")
    }

}

function qtdParcelasEdit()
{
    switch ( $("#inptEditTipoDivida").val() )
    {
        case "servico":
            $("#containerQtdParcelasEdit").hide()
            return '*'
        break;
        
        case "prestacao":
            $("#containerQtdParcelasEdit").show()
            return $("#inptQuantidadeParcelas").val()
        break;
                
        case "avista":
            $("#containerQtdParcelasEdit").hide()
            return 1
        break;
        
    }
    
}

function updateDivida()
{
    let id      = $("#idDivida").val()
    let pago    = $(`#inptEditPago`).is(':checked') ? 1 : 0
    let dados = 
    {
        "beneficiario":         $(`#inptEditBeneficiario`).val(),
        "dataEmissao":          formataDataBrUs( $(`#inptEditDataEmissao`).val() ),
        "dataPagamento":        formataDataBrUs( $(`#inptEditDataPagamento`).val() ),
        "dataVencimento":       formataDataBrUs( $(`#inptEditDataVencimento`).val() ),
        "descricao":            $(`#inptEditDescricao`).val(),
        "pago":                 pago,
        "quantidadeParcelas":   $(`#inptEditQuantidadeParcelas`).val(),
        "valorAPagar":          $(`#inptEditValorAPagar`).val(),
        "valorPago":            $(`#inptEditValor`).val() 
    }

    firebase.database()
        .ref('divida')
        .child(id)
        .update(dados)
        .then( (res) => console.log("Resposta: "+res) )
        .catch( (err) => console.log("Resposta: " + err) )
        .finally( () => location.reload() )
}
// DELETE
function mostraModalDeletarDivida(idDivida)
{
    firebase.database()
        .ref('divida')
        .child(idDivida)
        .remove()
        .then( () => location.reload() )
        .catch( (err) => console.log("Erro: "+err))
}

// SETs INICIAIS e extras
$("#btnEsconde").click( function() {
    escondeMostra()
    $("#aside").removeClass("col-md-2")
    $("#aside").hide()
    $("#containerTabela").addClass("col-md-12")
})
$("#btnMostra").click( function() {
    escondeMostra()
    $("#aside").addClass("col-md-2")
    $("#aside").show()
    $("#containerTabela").removeClass("col-md-12")
    $("#containerTabela").addClass("col-md-10")
})

function escondeMostra()
{
    $("#btnEsconde").toggle()
    $("#btnMostra").toggle()
}

/**
 * retorna data no formato YYYY/MM/DD
 */
 function formataDataUsBr(data)
 {
     return formataData(data)
 }
 
 /**
  * retorna data no formato DD/MM/YYYY
  */
 function formataDataBrUs(data)
 {
     return formataData(data)
 }
 
 function formataData(data)
 {
     let newData = data.split('-')
     return `${newData[2]}-${newData[1]}-${newData[0]}`
 }

 function getValoresFooter( item )
 {
     let capital = 6000 

     //TOTAL
     let inputFooterTotal = parseInt($("#footerTotal").val())
     inputFooterTotal +=  parseInt(item.val().valorAPagar)
     $("#footerTotal").val(inputFooterTotal)
     
     // PAGO
     let inputFooterPago = parseInt( $("#footerPago").val() )
     if ( item.val().pago == 1 )
     {
        inputFooterPago += parseInt(item.val().valorAPagar)
     }
     $("#footerPago").val(inputFooterPago)
     
     // RESTO
     $("#footerResto").val(capital - inputFooterPago)

     // CAPITAL
     parseInt($("#footerCapital").val(capital))
 }

 /**
  * Funcao destinada a filtrar as dividas de
  * acordo com mes/ano escolhido no selectbox
  */
 function filtraDividas()
 {
    $("#corpoTabela").html( ` ` )
     let mes = $("#selecionaMes").val()
     let ano = $("#selecionaAno").val()
     carregaDividas(mes, ano)
 }

 /**
  * funcao responsavel por preencher o selectbox dos anos
  * para o filtro de dividas
  */
 function preencheAnos(ano)
 {
    $("#selecionaAno").html(" ")
    $("#selecionaAno").append(`<option value="${ano}">${ano}</option>`)
 }