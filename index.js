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
            getAccountBalance()
        } else if(action === 'Depositar') {
            deposit()
        } else if(action === 'Sacar') {
            widthdraw()
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

function deposit() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual nome da sua conta?'
        }
    ])
    .then((awnser) => {
        const accountName = awnser['accountName']

        if(!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'value',
                message: 'Insira o valor a ser depositado:'
            }
        ])
        .then((awnser) => {
            const value = awnser['value']
            addValue(accountName, value)
            operation()
        })
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
}

function widthdraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual nome da sua conta?'
        }
    ])
    .then((awnser) => {
        const accountName = awnser['accountName']
        
        if(!checkAccount(accountName)){
            return widthdraw()
        }

        inquirer.prompt([
            {
                name: 'value',
                message: 'Insira o valor a ser sacado:'
            }
        ])
        .then((awnser) => {
            const value = awnser['value']
            removeValue(accountName, value)
        })
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
}

function getAccountBalance() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual nome da sua conta?'
        }
    ])
    .then((awnser) => {
        const accountName = awnser['accountName']

        if(!checkAccount(accountName)){
            return getAccountBalance()
        }

        const account = getAccount(accountName)
        const balance = parseFloat(account.balance)
        console.log(chalk.bgYellow.black(`O saldo atual da sua conta é: R$${balance}`))
        operation()
    })
    .catch(err => console.log(err))

}

function checkAccount(accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed('Esta conta não existe, escolha outro nome!'))
        return false
    }
    return true
}

function removeValue(accountName, value) {
    const account = getAccount(accountName)

    if(!value) {
        console.log(chalk.bgRed('Ocorreu um erro, tente novamente!'))
        return widthdraw()
    }
    
    if(parseFloat(value) > parseFloat(account.balance)){
        console.log(chalk.bgRed('A conta não possui o valor, tente novamente!'))
        return widthdraw()
    }

    account.balance = parseFloat(account.balance) - parseFloat(value)

    fs.writeFileSync(
        `accounts/${accountName}.json`, 
        JSON.stringify(account),
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`Foi sacado o valor de R$${value} da sua conta!`))
    operation()
}

function addValue(accountName, value) {
    const account = getAccount(accountName)

    if(!value) {
        console.log(chalk.bgRed('Ocorreu um erro, tente novamente!'))
        deposit()
    }
    account.balance = parseFloat(value) + parseFloat(account.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`, 
        JSON.stringify(account),
        function (err) {
            console.log(err)
        }
    )
    console.log(chalk.green(`Foi depositado o valor de R$${value} na sua conta!`))
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })
    return JSON.parse(accountJSON)
}
