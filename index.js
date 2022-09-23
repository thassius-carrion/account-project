const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs')

operation()

function operation() {

    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que deseja fazer?',
            choices: [
                'Criar Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ]
        }
    ]).then((awnser) => {

        const action = awnser['action']

        if(action === 'Criar Conta'){
            createAccount()
        } else if(action === 'Consultar Saldo') {

        } else if(action === 'Depositar') {

        } else if(action === 'Sacar') {

        } else if(action === 'Sair') {
            console.log(chalk.bgBlue('Obrigado por usar o Accounts!'))
            process.exit()
        }

    }).catch(err => console.log(err))
}

function createAccount() {
    console.log(chalk.bgGreen.green('Obrigado por escolher o nosso banco.'))
    console.log(chalk.green('Para criar sua conta, responda as perguntas abaixo:'))

    buildAccount()
}

function buildAccount() {

    if(!fs.existsSync('accounts')){
        fs.mkdirSync('accounts')
    }

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Escreva o nome da sua conta: '
        }
    ]).then((awnser) => {

        const accountName = awnser['accountName']

        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed('Esta conta ja existe!'))
            buildAccount()
            return
        }
        
        fs.writeFileSync(
            `accounts/${accountName}.json`, 
            '{"balance": 0}', 
            function(err){
                console.log(err)
            },
        )
        console.log(chalk.green("Parabens, sua conta foi criada!"))
        operation()

    }).catch(err => console.log(err))
}
