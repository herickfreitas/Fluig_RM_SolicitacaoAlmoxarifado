function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {


	var dataset = DatasetBuilder.newDataset();
    
	 dataset.addColumn("CODFILIAL");
	 dataset.addColumn("NOMEFANTASIA");
	     
	    var tempDataset = getDefaultValues(); // consulta a fonte de dados do dataset
	    if(constraints!=null && constraints.length) {   

	        for(var a=0;a<   tempDataset.rowsCount;a++){
	        	 if(constraints[0].initialValue==tempDataset.getValue(a,[constraints[0].fieldName])){
		        	var filial = tempDataset.getValue(a,"CODFILIAL");
		        	var fantasia = tempDataset.getValue(a,"NOMEFANTASIA");
		            dataset.addRow(new Array(
		            		filial, 
		            		fantasia));
	        	 }
	        }
	    }
	    else
	    {
	    	for(var a=0;a<   tempDataset.rowsCount;a++){
		        	var filialt = tempDataset.getValue(a,"CODFILIAL");
		        	var fantasiat = tempDataset.getValue(a,"NOMEFANTASIA");
		            dataset.addRow(new Array(
		            		filialt, 
		            		fantasiat));
	        	 }
	    }
	    		    
	   
	    return dataset;
	    	
}

function getDefaultValues(){ 

	//var constraint_RM_ITENS_ALMOX_Filtro = DatasetFactory.createConstraint('CODFILIAL', '1', '1', ConstraintType.MUST);
	//var dataset_RM_ITENS_ALMOX = DatasetFactory.getDataset('_RM_ITENS_ALMOX', null, new Array(constraint_RM_ITENS_ALMOX_Filtro), null);
	
	var dataset_RM_ITENS_ALMOX = DatasetFactory.getDataset('_RM_ITENS_ALMOX', null, null, null);
    return  dataset_RM_ITENS_ALMOX;
}

function onMobileSync(user) {

}