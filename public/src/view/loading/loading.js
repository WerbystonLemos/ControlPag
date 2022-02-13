function showLoading()
{
    let divTagContainer = document.createElement("div")
    let divTag          = document.createElement("div")
    let tagImg          = document.createElement("img")
    
    divTagContainer.setAttribute("id", "containerLoading")
    divTagContainer.style.display        = "flex"
    divTagContainer.style.justifyContent = "center"
    divTagContainer.style.alignItems     = "center"
    divTagContainer.style.position       = "absolute"
    divTagContainer.style.top            = "0"
    divTagContainer.style.zIndex         = "9999"
    divTagContainer.style.width          = "100vw"
    divTagContainer.style.height         = "100vh"
    divTagContainer.style.background     = "white"
    
    tagImg.setAttribute("src", "../img/loading.gif")
    
    divTag.appendChild(tagImg)
    divTagContainer.appendChild(divTag)
    document.querySelector("body").appendChild(divTagContainer)
}

function hideLoading()
{
    /**
     * essa funcao esta errada pelo fato da linha de cod a baixo esta OCULTANDO
     * e nao DESTRUINDO como e o intuito 
     * como a muie ta insistindo p ir assistir eu a patroa e as criancas vou ter 
     * que pesquisar a solucao depois
     * CASA TBM BESTA...E BOM...CONFIA MIZERAVI
     */
    document.querySelector("#containerLoading").style.display = "none"
}