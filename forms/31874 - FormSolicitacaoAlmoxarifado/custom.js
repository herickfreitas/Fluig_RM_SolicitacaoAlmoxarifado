function recarregazoom(filial, linha){
	// Efetuando filtro na seleção de itens conforme a filial informada.
	var codFilial = filial;
	var filterValues = "CODFILIAL," + codFilial;
	//console.log(filterValues);
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

		