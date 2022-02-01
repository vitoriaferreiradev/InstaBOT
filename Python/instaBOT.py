from playwright.sync_api import sync_playwright
import re

def showInformations(username, likes) :
    FIRST_EXPRESSION = 'Curtido por [aA-zZ]+ e outras \d.+ pessoas'
    SECOND_EXPRESSION = '\d.+ curtidas'
    LIKES_AMOUNT = re.sub(r'[aA-zZ]+', '', likes)
    TOTAL_LIKES = float(LIKES_AMOUNT)

    if re.match(FIRST_EXPRESSION, likes):
        print(f'O post da conta {username} recebeu {TOTAL_LIKES + 1} curtidas')
    elif re.match(SECOND_EXPRESSION, likes):
        print(f'O post da conta {username} recebeu {likes} curtidas')
    else:
        print(f'A conta {username} optou por não exibir o número de curtidas')

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=100)
        page = browser.new_page()
        page.goto("https://www.instagram.com/")

        # Insere os dados da conta e realiza login
        USERNAME = page.locator('#loginForm > div > div:nth-child(1) > div > label > input').type('<INSIRA AQUI SEU USUARIO>', delay=45)
        PASSWORD = page.locator('#loginForm > div > div:nth-child(2) > div > label > input').type('<INSIRA AQUI SUA SENHA>', delay=45)
        page.click('#loginForm > div > div:nth-child(3)')

        # Fecha os popups
        page.click('#react-root > section > main > div > div > div > div > button')
        page.click('div.mt3GC button.aOOlW.HoLwm')

        # Coleta informações do 3º post
        page.focus('article:nth-child(3)')
        POST_USERNAME = page.text_content('article:nth-child(3) div.RqtMr > div > span > a')
        
        # Verifica se post é um video
        IS_VIDEO = page.query_selector('article:nth-child(3) > div > div.qF0y9.Igw0E.IwRSH.eGOV_._4EzTm section.EDfFK.ygqzn > div > span.vcOH2')

        if IS_VIDEO is not None:
            page.click('article:nth-child(3) > div > div.qF0y9.Igw0E.IwRSH.eGOV_._4EzTm section.EDfFK.ygqzn > div > span.vcOH2')
            post_likes = page.text_content('article:nth-child(3) div.qF0y9.Igw0E.IwRSH.eGOV_._4EzTm section.EDfFK.ygqzn div.vJRqr')
        else:
            post_likes = page.text_content('article:nth-child(3) div.qF0y9 div.Nm9Fw')
            
        browser.close()

        # Exibi resultado no console
        showInformations(POST_USERNAME, post_likes)
except:
    print('Ocorreu um erro!')


        