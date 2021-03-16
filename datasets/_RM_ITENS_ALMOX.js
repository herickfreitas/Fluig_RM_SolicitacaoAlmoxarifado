function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();
    var dataSource = "/jdbc/FluigRM"; 
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;
    
    log.info("QUERY constraints: " + constraints);
    
    var processo = "";
    for (var i = 0; i < constraints.length; i++) {
        if (constraints[i].fieldName == 'CODFILIAL') {
            processo = constraints[i].initialValue;    
        }
    }

    var usuarioSolicitante = "";
    for (var i = 0; i < constraints.length; i++) {
        if (constraints[i].fieldName == 'CODUSUARIO') {
        	usuarioSolicitante = constraints[i].initialValue; 
        	log.info("_RM_ITENS_ALMOX usuarioSolicitante: " + usuarioSolicitante);
        }
    }
    
	// usuários que podem solicitar medicamentos
	var listaSERBEM = ['flaviaalves','camilaribas']; 	// ,'herickfreitas'
	log.info("listaSERBEM: " + listaSERBEM);
	
	// verificando se solicitante esta na lista
	var idx = "";
	for (var i = 0; i < listaSERBEM.length; i++) {
		if (listaSERBEM[i] == usuarioSolicitante) {
			idx = listaSERBEM[i];
			log.info("idx: " + idx);
		}
	}
	
	
	if (idx != "") {
    	var myQuery = "SELECT * FROM _Fluig_ITENS_ALMOX WHERE CODFILIAL = "+"'"+processo+"'";
    	
    }
    
    else {
    	var myQuery = "SELECT * FROM _Fluig_ITENS_ALMOX WHERE CODIGOPRD NOT LIKE '05.%' AND CODFILIAL = "+"'"+processo+"'";
    	
    }
    
    
    log.info("QUERY: " + myQuery);
    try {
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
        var rs = stmt.executeQuery(myQuery);
        var columnCount = rs.getMetaData().getColumnCount();
        while (rs.next()) {
            if (!created) {
                for (var i = 1; i <= columnCount; i++) {
                    newDataset.addColumn(rs.getMetaData().getColumnName(i));
                }
                created = true;
            }
            var Arr = new Array();
            for (var i = 1; i <= columnCount; i++) {
                var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                if (null != obj) {
                    Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                } else {
                    Arr[i - 1] = "null";
                }
            }
            newDataset.addRow(Arr);
        }
    } catch (e) {
        log.error("ERRO==============> " + e.message);
    } finally {
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();
        }
    }
    return newDataset;
}

/*
function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

}function onMobileSync(user) {

}
*/