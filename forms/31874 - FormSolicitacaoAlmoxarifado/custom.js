
function recarregazoom(filial, linha){

	// Efetuando filtro na seleção de itens conforme a filial informada.
	//	ATENCAO HÁ UM FILTRO NO DATASET PARA USUÁRIOS QUE PODEM SOLICITAR MEDICAMENTOS.
	var codFilial = filial;
	var usuario = document.getElementById("solicitante").value; 
	var usuarioSolicitante = usuario.toLowerCase()
	var filterValues = "CODFILIAL," + codFilial+','+"CODUSUARIO,"+usuarioSolicitante;
	console.log("filterValues: "+filterValues );
	reloadZoomFilterValues('nomeItem___'+linha, filterValues );
}

	
function fnCustomDelete(oElement){
	// Funcao que libera a seleção de filial quando todos os itens são removidos
    fnWdkRemoveChild(oElement);
    if ($('#tbProdutos')[0].rows.length-2==0){
    	window["filial"].disable(false);
    	window["ccusto"].disable(false);
    	
    }
 }

		