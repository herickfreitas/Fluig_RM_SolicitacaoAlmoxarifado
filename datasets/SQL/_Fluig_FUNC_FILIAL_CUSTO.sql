USE [Corporerm_Homolog]
GO

/****** Object:  View [dbo].[_Fluig_FUNC_FILIAL_CUSTO]    Script Date: 09/03/2021 00:52:09 ******/
SET ANSI_NULLS OFF
GO

SET QUOTED_IDENTIFIER OFF
GO


ALTER VIEW [dbo].[_Fluig_FUNC_FILIAL_CUSTO] AS

SELECT LOWER(PPESSOA.CODUSUARIO) CODUSUARIO, NROFILIALCONT AS CODFILIAL , PSECAO.NROCENCUSTOCONT AS CODCCUSTO
,	GCCUSTO.CODCCUSTO+' - '+GCCUSTO.NOME AS CUSTO_NOME
,	CONVERT(varchar(1),GFILIAL.CODFILIAL)+' - '+GFILIAL.NOMEFANTASIA AS NOMEFILIAL
FROM PFUNC 
	JOIN PPESSOA	ON (PFUNC.CODPESSOA=PPESSOA.CODIGO)
	JOIN PSECAO		ON (PFUNC.CODSECAO=PSECAO.CODIGO)
	JOIN GCCUSTO	ON (PSECAO.NROCENCUSTOCONT=GCCUSTO.CODCCUSTO)
	JOIN GFILIAL	ON (PSECAO.NROFILIALCONT=GFILIAL.CODFILIAL)
WHERE	PFUNC.CODSITUACAO	<> 'D' /* Descartando os demitidos */
AND		PPESSOA.CODUSUARIO	IS NOT NULL

GO


