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
    ]).then().catch(err => console.log(err))
}
