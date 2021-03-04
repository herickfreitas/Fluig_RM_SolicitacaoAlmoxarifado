function validateForm(form){
	
	var activity = getValue('WKNumState');
	var inicioPadrao = 0;
	
	log.info("displayFields WKNumState "+activity);
	
	if (activity != inicioPadrao)  {

		var msg = "";
		var hasErros = false;
		
		if (form.getValue('filial') == ""){
			msg += "Filial tem preenchimento obrigatório.\n";
			var hasErros = true;
			}
		if (form.getValue('ccusto') == ""){
			msg += "Centro de custo tem preenchimento obrigatório. \n";
			var hasErros = true;
			}
		if (form.getValue('observacaoMov') == ""){
			msg += "Justificativa tem preenchimento obrigatório. \n";
			var hasErros = true;
			}
		if (hasErros == true) {
			throw msg;
			}
	}
}	
