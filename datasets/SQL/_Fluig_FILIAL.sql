USE [Corporerm_Homolog]
GO

/****** Object:  View [dbo].[_Fluig_FILIAL]    Script Date: 01/03/2021 15:52:49 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




CREATE VIEW [dbo].[_Fluig_FILIAL] AS

SELECT 

	CODFILIAL
,	CONVERT(varchar(1),CODFILIAL)+' - '+NOMEFANTASIA AS NOMEFANTASIA
,	NOME


FROM GFILIAL(NOLOCK) 


GO

