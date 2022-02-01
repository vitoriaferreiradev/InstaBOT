const { chromium } = require('playwright')
require('dotenv').config()

;(async () => {
  try {
    const browser = await chromium.launch({ headless: false, slowMo: 100 })
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('https://www.instagram.com/')

    // Insere os dados da conta e realiza o login
    const username = page.locator('#loginForm > div > div:nth-child(1) > div > label > input')
    await username.type(process.env.USER || '<INSIRA AQUI SEU USUARIO>', {delay: 45})
    const password = page.locator('#loginForm > div > div:nth-child(2) > div > label > input')
    await password.type(process.env.PASSWORD || '<INSIRA AQUI SUA SENHA>', {delay: 45})
    await page.click('#loginForm > div > div:nth-child(3)')

    // Fecha os popups
    await page.click('#react-root > section > main > div > div > div > div > button')
    await page.click('div.mt3GC button.aOOlW.HoLwm')

    // Coleta informações do terceiro post
    await page.focus('article:nth-child(3)')
    const post_username = await page.textContent('article:nth-child(3) div.RqtMr > div > span > a')
    let post_likes;

    // Verifica se post é video 
    const isVideo = await page.evaluate(() => {
      result = document.querySelector('article:nth-child(3) > div > div.qF0y9.Igw0E.IwRSH.eGOV_._4EzTm section.EDfFK.ygqzn > div > span.vcOH2')
      return result != null
    })

    if (isVideo) {
      page.click('article:nth-child(3) > div > div.qF0y9.Igw0E.IwRSH.eGOV_._4EzTm section.EDfFK.ygqzn > div > span.vcOH2')
      post_likes = await page.textContent('article:nth-child(3) div.qF0y9.Igw0E.IwRSH.eGOV_._4EzTm section.EDfFK.ygqzn div.vJRqr')
    } else {
      post_likes = await page.textContent('article:nth-child(3) div.qF0y9 div.Nm9Fw')
    } 

    // Exibi os dados coletados no console
    showInformations(post_username, post_likes)
    
  } catch (err) {
    console.log(err)
  }
})()

function showInformations(username, likes) {
  const first_expression = /Curtido por [aA-zZ]+ e outras \d.+ pessoas/
  const second_expression = /\d.+ curtidas/
  const total_likes = Number(likes.replace(/[aA-zZ]/g, '').replace('.', ''))

  return likes.match(first_expression)
    ? console.log(`O post da conta ${username} recebeu ${total_likes + 1} curtidas`)
    : likes.match(second_expression)
    ? console.log(`O post da conta ${username} recebeu ${total_likes} curtidas`)
    : console.log(`A conta ${username} optou por não exibir o número de curtidas`)
}
