var SeqProcessamento = 172;
var SeqAprovado = 8; // Inserir movimento no RM
var Usuario = 'integracao';
var Senha = '!2018@Minha!';


function beforeStateEntry(sequenceId){

	
	log.info("beforeStateEntry "+sequenceId);
	
	//If para sequenciar conforme etapas do processo
    if (sequenceId == SeqProcessamento) {
    	ProcessamentoWorkflow();
    }
    
    else if (sequenceId == SeqAprovado) {
    	AprovarWorkflow();
    }
	
}


function ProcessamentoWorkflow(){
	try { 
		
		log.info("==========[ ProcessamentoWorkflow ENTROU ]==========");
	
		//Recupera o usuário corrente associado a atividade
		var requisitante = getValue("WKUser");		
		log.info("==========[ ProcessamentoWorkflow requisitante ]=========="+requisitante);
		
		// Gravando valores no formulário
		hAPI.setCardValue("solicitante", requisitante);
		

		// TRATANDO RESPONSÁVEL PELO CENTRO DE CUSTO - INICIO //
		
		// Coleta do centro de custo seleciondo no formulário
        var ccustoTotal = hAPI.getCardValue("ccusto");
        var ccusto = ccustoTotal.substring(0,18);
        log.info("==========[ ProcessamentoWorkflow ccustoTotal ]=========="+ccustoTotal);
        log.info("==========[ ProcessamentoWorkflow ccusto ]=========="+ccusto);

 
        // Rodando novo dataset para coletar responsável do centro de custo
        var c1 = DatasetFactory.createConstraint("CODCCUSTO", ccusto, ccusto, ConstraintType.MUST);
        var constraints = new Array(c1);
        log.info("==========[ ProcessamentoWorkflow constraints ]========== " + constraints);
        
        // Executando chamada de dataset
        var datasetReturned = DatasetFactory.getDataset("_RM_GESTOR_CENTRO_CUSTO", null, constraints, null);
        
		// Retirando o campo do resultado
		var chefe = datasetReturned.getValue(0, "RESPONSAVEL");
		log.info("==========[ ProcessamentoWorkflow createDataset chefe ]========== " + chefe);        
        
        // Gravando retorno no formulário		
		hAPI.setCardValue("gestorcc", chefe);

		
		}
	
	catch (e)
	{
		log.error(e);
		throw e;
		}
	}	
	

	function AprovarWorkflow(){ // Inserir movimento no RM
		try { 
			
            // Criar o objeto de Integracao
            var SERVICE_STUB = ServiceManager.getService('RMWsDataServer');
            log.info("AprovarWorkflow-> SERVICE_STUB: " + SERVICE_STUB);
            
            var SERVICE_HELPER = SERVICE_STUB.getBean();
            log.info("AprovarWorkflow-> SERVICE_HELPER: " + SERVICE_HELPER);
            
            // Criar o obejto da classe principal do Servico
            var wsDataServer = SERVICE_HELPER.instantiate('com.totvs.WsDataServer');
            log.info("AprovarWorkflow-> wsDataServer: " + wsDataServer);

            // Obter o objeto do WS
            var iWsDataServer = wsDataServer.getRMIwsDataServer();
            log.info("AprovarWorkflow-> iWsDataServer: " + iWsDataServer);
            
            // Configurar a autentica??o
            var authIwsDataServer = SERVICE_STUB.getBasicAuthenticatedClient(iWsDataServer, 'com.totvs.IwsDataServer', Usuario, Senha);
            log.info("AprovarWorkflow -> authIwsDataServer: " + authIwsDataServer);
            
            // Passar os parametros
            var dataServerName = "MovMovimentoTBCData";
            var contexto = "CODCOLIGADA=1;CODUSUARIO=integracao;CODSISTEMA=T";
            // Chamada da função com os dados do movimento
            var XML = GetXml();
            
            var result = authIwsDataServer.saveRecord(dataServerName, XML, contexto);
            log.info("AprovarWorkflow-> authIwsDataServer.saveRecord: " + result);
            
            if ((result != null) && (result.indexOf("===") != -1)) {
                var msgErro = result.substring(0, result.indexOf("==="));                
                throw msgErro;
            }        

            return result;

		}
		
		catch (e)
		{
            if (e == null)  e = "Erro desconhecido!";  
            var mensagemErro = "Ocorreu um erro ao salvar dados no RM: " + e;  
            throw mensagemErro+"ERRO NO RM "+result;  
		}
	
	}	
	
	
	
	function GetXml() {
		
		log.info("CUSTOM: geraXmlContrato - inicio");
		var XML;
		
		// Coletando informações do form para XML
		var IDFLUIG = getValue('WKNumProces');
		var SOLICITANTE = hAPI.getCardValue("solicitante");
		var CODFILIAL = (hAPI.getCardValue("filial")).substring(0,1);
        var CODCCUSTO = (hAPI.getCardValue("ccusto")).substring(0,17);
        var TRANSACAO = (hAPI.getCardValue("transacao")).substring(0,3);
        var HOJE = new Date().toISOString().slice(0,19); // Formato ""+DTDESPESAFORMAT+"T22:34:02"
        var HISTORICO = "SOLICITAÇÃO FLUIG : "+IDFLUIG+" - "+"SOLICITANTE : "+SOLICITANTE.toUpperCase()+" - "+"TRANSACAO : "+(hAPI.getCardValue("transacao")).toUpperCase()+" - "+ (hAPI.getCardValue("observacaoMov")).toUpperCase();
        //var HISTORICO = "Solicitação Fluig : "+IDFLUIG+" - "+(hAPI.getCardValue("observacaoMov"));
        
        
        
        // Estruturando XML
		XML = "<MovMovimento >" +   
		" <TMOV>	"  + 
		" <CODCOLIGADA>1</CODCOLIGADA>	"  + 
		" <IDMOV>-1</IDMOV>	"  + 
		" <CODFILIAL>"+CODFILIAL+"</CODFILIAL>	"  + 
		" <CODLOC>0"+CODFILIAL+"</CODLOC>	"  + 
		" <CODLOCDESTINO>0"+CODFILIAL+"</CODLOCDESTINO>	"  + 
		" <NUMEROMOV>0</NUMEROMOV>	"  + 
		" <SERIE>PRDM</SERIE>	"  + 
		" <CODTMV>1.1.16</CODTMV>	"  + 
		" <TIPO>P</TIPO>	"  + 
		" <STATUS>A</STATUS>	"  + 
		" <MOVIMPRESSO>0</MOVIMPRESSO>	"  + 
		" <DOCIMPRESSO>0</DOCIMPRESSO>	"  + 
		" <FATIMPRESSA>0</FATIMPRESSA>	"  + 
		" <DATAEMISSAO>"+HOJE+"</DATAEMISSAO>	"  + 
		" <DATASAIDA>"+HOJE+"</DATASAIDA>	"  + 
		" <COMISSAOREPRES>0.0000</COMISSAOREPRES>	"  + 
		" <VALORBRUTO>0.0000</VALORBRUTO>	"  + 
		" <VALORLIQUIDO>0.0000</VALORLIQUIDO>	"  + 
		" <VALOROUTROS>0.0000</VALOROUTROS>	"  + 
		" <PERCENTUALFRETE>0.0000</PERCENTUALFRETE>	"  + 
		" <VALORFRETE>0.0000</VALORFRETE>	"  + 
		" <PERCENTUALSEGURO>0.0000</PERCENTUALSEGURO>	"  + 
		" <VALORSEGURO>0.0000</VALORSEGURO>	"  + 
		" <PERCENTUALDESC>0.0000</PERCENTUALDESC>	"  + 
		" <VALORDESC>0.0000</VALORDESC>	"  + 
		" <PERCENTUALDESP>0.0000</PERCENTUALDESP>	"  + 
		" <VALORDESP>0.0000</VALORDESP>	"  + 
		" <PERCCOMISSAO>0.0000</PERCCOMISSAO>	"  + 
		" <PESOLIQUIDO>0.0000</PESOLIQUIDO>	"  + 
		" <PESOBRUTO>0.0000</PESOBRUTO>	"  + 
		" <CODTB3FAT>"+TRANSACAO+"</CODTB3FAT>	"  + 
		" <CODMOEVALORLIQUIDO>R$</CODMOEVALORLIQUIDO>	"  + 
		" <DATAMOVIMENTO>"+CODFILIAL+"</DATAMOVIMENTO>	"  + 
		" <GEROUFATURA>0</GEROUFATURA>	"  + 
		" <CODCCUSTO>"+CODCCUSTO+"</CODCCUSTO>	"  + 
		" <PERCCOMISSAOVEN2>0.0000</PERCCOMISSAOVEN2>	"  + 
		" <CODUSUARIO>"+SOLICITANTE+"</CODUSUARIO>	"  + 
		" <CODFILIALDESTINO>"+CODFILIAL+"</CODFILIALDESTINO>	"  + 
		" <GERADOPORLOTE>0</GERADOPORLOTE>	"  + 
		" <STATUSEXPORTCONT>0</STATUSEXPORTCONT>	"  + 
		" <GEROUCONTATRABALHO>0</GEROUCONTATRABALHO>	"  + 
		" <GERADOPORCONTATRABALHO>0</GERADOPORCONTATRABALHO>	"  + 
		" <HORULTIMAALTERACAO>"+HOJE+"</HORULTIMAALTERACAO>	"  + 
		" <INDUSOOBJ>0.00</INDUSOOBJ>	"  + 
		" <INTEGRADOBONUM>0</INTEGRADOBONUM>	"  + 
		" <FLAGPROCESSADO>0</FLAGPROCESSADO>	"  + 
		" <ABATIMENTOICMS>0.0000</ABATIMENTOICMS>	"  + 
		" <HORARIOEMISSAO>"+HOJE+"</HORARIOEMISSAO>	"  + 
		" <USUARIOCRIACAO>"+SOLICITANTE+"</USUARIOCRIACAO>	"  + 
		" <DATACRIACAO>"+HOJE+"</DATACRIACAO>	"  + 
		" <STSEMAIL>0</STSEMAIL>	"  + 
		" <VALORBRUTOINTERNO>0.0000</VALORBRUTOINTERNO>	"  + 
		" <VINCULADOESTOQUEFL>0</VINCULADOESTOQUEFL>	"  + 
		" <VRBASEINSSOUTRAEMPRESA>0.0000</VRBASEINSSOUTRAEMPRESA>	"  + 
		" <VALORDESCCONDICIONAL>0.0000</VALORDESCCONDICIONAL>	"  + 
		" <VALORDESPCONDICIONAL>0.0000</VALORDESPCONDICIONAL>	"  + 
		" <CONTORCAMENTOANTIGO>0</CONTORCAMENTOANTIGO>	"  + 
		" <DATACONTABILIZACAO>"+CODFILIAL+"</DATACONTABILIZACAO>	"  + 
		" <INTEGRADOAUTOMACAO>0</INTEGRADOAUTOMACAO>	"  + 
		" <INTEGRAAPLICACAO>T</INTEGRAAPLICACAO>	"  + 
		" <DATALANCAMENTO>"+HOJE+"</DATALANCAMENTO>	"  + 
		" <EXTENPORANEO>0</EXTENPORANEO>	"  + 
		" <RECIBONFESTATUS>0</RECIBONFESTATUS>	"  + 
		" <VALORMERCADORIAS>0.0000</VALORMERCADORIAS>	"  + 
		" <USARATEIOVALORFIN>0</USARATEIOVALORFIN>	"  + 
		" <CODCOLCFOAUX>0</CODCOLCFOAUX>	"  + 
		" <VALORRATEIOLAN>0.0000</VALORRATEIOLAN>	"  + 
		" <HISTORICOLONGO>"+HISTORICO+"</HISTORICOLONGO>	"  +
		" <HISTORICOCURTO>"+HISTORICO+"</HISTORICOCURTO>	"  + 
		" <RATEIOCCUSTODEPTO>0.0000</RATEIOCCUSTODEPTO>	"  + 
		" <VALORBRUTOORIG>0.0000</VALORBRUTOORIG>	"  + 
		" <VALORLIQUIDOORIG>0.0000</VALORLIQUIDOORIG>	"  + 
		" <VALOROUTROSORIG>0.0000</VALOROUTROSORIG>	"  + 
		" <VALORRATEIOLANORIG>0.0000</VALORRATEIOLANORIG>	"  + 
		" <FLAGCONCLUSAO>0</FLAGCONCLUSAO>	"  + 
		" <STATUSPARADIGMA>N</STATUSPARADIGMA>	"  + 
		" <STATUSINTEGRACAO>N</STATUSINTEGRACAO>	"  + 
		" <RECCREATEDBY>"+SOLICITANTE+"</RECCREATEDBY>	"  + 
		" <RECCREATEDON>"+HOJE+"</RECCREATEDON>	"  + 
		" <RECMODIFIEDBY>"+SOLICITANTE+"</RECMODIFIEDBY>	"  + 
		" <RECMODIFIEDON>"+HOJE+"</RECMODIFIEDON>	"  + 
		" <STATUSMOVINCLUSAOCOLAB>0</STATUSMOVINCLUSAOCOLAB>	"  + 
		" <CODCOLIGADA1>1</CODCOLIGADA1>	"  + 
		" <IDMOVHST>-1</IDMOVHST>	"  + 
		"	  </TMOV>	"  

		

		// COLETA DE INFORMAÇÕES DO ZOOM nomeItem //
		var indexes = hAPI.getChildrenIndexes("tbProdutos");
		for (var i = 0; i < indexes.length; i++) {
			var NSEQITMMOV = i+1;
			var item = (hAPI.getCardValue("nomeItem___" + indexes[i]));
			var codigoprd = item.substring(0,10);
			log.info("==========[ getChildrenIndexes codigoprd ]========== " + codigoprd);
			// Rodando dataset para coletar detalhes dos produtos
	        var T1 = DatasetFactory.createConstraint("CODIGOPRD", codigoprd, codigoprd, ConstraintType.MUST);
	        var constraints = new Array(T1);
	        var datasetReturned = DatasetFactory.getDataset("_RM_TPRODUTO", null, constraints, null);
			// Retirando o campo do resultado
			var IDPRD = datasetReturned.getValue(0, "IDPRD");
			log.info("==========[ getChildrenIndexes IDPRD ]========== " + IDPRD); 	        
			var NOMEFANTASIA = datasetReturned.getValue(0, "NOMEFANTASIA");
			log.info("==========[ getChildrenIndexes NOMEFANTASIA ]========== " + NOMEFANTASIA);
			
			var qtd = (hAPI.getCardValue("quantidade___" + indexes[i]));
			log.info("==========[ getChildrenIndexes quantidade ]========== " + qtd);
		 			
			XML = XML + 
			"	  <TITMMOV>	"  + 
			" <CODCOLIGADA>1</CODCOLIGADA>	"  + 
			" <IDMOV>-1</IDMOV>	"  + 
			" <NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>	"  + 
			" <CODFILIAL>"+CODFILIAL+"</CODFILIAL>	"  + 
			" <NUMEROSEQUENCIAL>"+NSEQITMMOV+"</NUMEROSEQUENCIAL>	"  + 
			" <IDPRD>"+IDPRD+"</IDPRD>	"  + 
			" <CODIGOPRD>"+codigoprd+"</CODIGOPRD>	"  + 
			" <NOMEFANTASIA>"+NOMEFANTASIA+"</NOMEFANTASIA>	"  + 
			" <QUANTIDADE>"+qtd+"</QUANTIDADE>	"  + 
			" <PRECOUNITARIO>0.0000</PRECOUNITARIO>	"  + 
			" <PRECOTABELA>0.0000</PRECOTABELA>	"  + 
			" <DATAEMISSAO>"+CODFILIAL+"</DATAEMISSAO>	"  + 
			" <QUANTIDADEARECEBER>"+qtd+"</QUANTIDADEARECEBER>	"  + 
			" <VALORUNITARIO>0.0000</VALORUNITARIO>	"  + 
			" <VALORFINANCEIRO>0.0000</VALORFINANCEIRO>	"  + 
			" <CODCCUSTO>"+CODCCUSTO+"</CODCCUSTO>	"  + 
			" <ALIQORDENACAO>0.0000</ALIQORDENACAO>	"  + 
			" <QUANTIDADEORIGINAL>"+qtd+"</QUANTIDADEORIGINAL>	"  + 
			" <FLAG>0</FLAG>	"  + 
			" <BLOCK>0</BLOCK>	"  + 
			" <FATORCONVUND>0.0000</FATORCONVUND>	"  + 
			" <VLTRANSPITEM>0.0000</VLTRANSPITEM>	"  + 
			" <VALORTOTALITEM>0.0000</VALORTOTALITEM>	"  + 
			" <QUANTIDADESEPARADA>0.0000</QUANTIDADESEPARADA>	"  + 
			" <PERCENTCOMISSAO>0.0000</PERCENTCOMISSAO>	"  + 
			" <COMISSAOREPRES>0.0000</COMISSAOREPRES>	"  + 
			" <VALORESCRITURACAO>0.0000</VALORESCRITURACAO>	"  + 
			" <VALORFINPEDIDO>0.0000</VALORFINPEDIDO>	"  + 
			" <VALOROPFRM1>0.0000</VALOROPFRM1>	"  + 
			" <VALOROPFRM2>0.0000</VALOROPFRM2>	"  + 
			" <PRECOEDITADO>0</PRECOEDITADO>	"  + 
			" <PRECOTOTALEDITADO>0</PRECOTOTALEDITADO>	"  + 
			" <VALORDESCCONDICONALITM>0.0000</VALORDESCCONDICONALITM>	"  + 
			" <VALORDESPCONDICIONALITM>0.0000</VALORDESPCONDICIONALITM>	"  + 
			" <VALORUNTORCAMENTO>0.0000</VALORUNTORCAMENTO>	"  + 
			" <VALSERVICONFE>0.0000</VALSERVICONFE>	"  + 
			" <CODLOC>0"+CODFILIAL+"</CODLOC>	"  + 
			" <VALORBEM>0.0000</VALORBEM>	"  + 
			" <VALORLIQUIDO>0.0000</VALORLIQUIDO>	"  + 
			" <RATEIOCCUSTODEPTO>0.0000</RATEIOCCUSTODEPTO>	"  + 
			" <VLTRANSPITEMORIG>0.0000</VLTRANSPITEMORIG>	"  + 
			" <QUANTIDADETOTAL>"+qtd+"</QUANTIDADETOTAL>	"  + 
			" <PRODUTOSUBSTITUTO>0</PRODUTOSUBSTITUTO>	"  + 
			" <PRECOUNITARIOSELEC>0</PRECOUNITARIOSELEC>	"  + 
			" <INTEGRAAPLICACAO>T</INTEGRAAPLICACAO>	"  + 
			" <RECCREATEDBY>"+SOLICITANTE+"</RECCREATEDBY>	"  + 
			" <RECCREATEDON>"+HOJE+"</RECCREATEDON>	"  + 
			" <RECMODIFIEDBY>"+SOLICITANTE+"</RECMODIFIEDBY>	"  + 
			" <RECMODIFIEDON>"+HOJE+"</RECMODIFIEDON>	"  + 
			" <CODCOLIGADA1>1</CODCOLIGADA1>	"  + 
			" <IDMOVHST>-1</IDMOVHST>	"  + 
			" <NSEQITMMOV1>1</NSEQITMMOV1>	"  + 
			"	  </TITMMOV>	"; 
		
			XML = XML +
			"	  <TITMMOVCOMPL>	"  + 
			" <CODCOLIGADA>1</CODCOLIGADA>	"  + 
			" <IDMOV>-1</IDMOV>	"  + 
			" <NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>	"  + 
			" <RECCREATEDBY>"+SOLICITANTE+"</RECCREATEDBY>	"  + 
			" <RECCREATEDON>"+HOJE+"</RECCREATEDON>	"  + 
			" <RECMODIFIEDBY>"+SOLICITANTE+"</RECMODIFIEDBY>	"  + 
			" <RECMODIFIEDON>"+HOJE+"</RECMODIFIEDON>	"  + 
			" <SERVICO>0.0000</SERVICO>	"  + 
			"	  </TITMMOVCOMPL>	";
			
			}
		
		
		
		
		XML = XML + "</MovMovimento>";
		 
		log.info("CUSTOM: geraXML"+XML );
		 
		return XML;
			      
			}  
	
