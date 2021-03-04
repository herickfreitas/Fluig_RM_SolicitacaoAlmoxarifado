function recarregazoom(filial, linha){

	var codFilial = filial;
	
	var filterValues = "CODFILIAL," + codFilial;
	console.log(filterValues);
	
	reloadZoomFilterValues('nomeItem___'+linha, filterValues );

}	

//Ao realizar a exclusão verificar se a quantidade de filhos é 0, se for habilita novamente a filial
///$('#filial')[0].children.length
	





