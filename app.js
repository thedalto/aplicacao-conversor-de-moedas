/*
  - Construa uma aplicação de conversão de moedas. O HTML e CSS são os que você
    está vendo no browser;
  - Você poderá modificar a marcação e estilos da aplicação depois. No momento, 
    concentre-se em executar o que descreverei abaixo;
    - Quando a página for carregada: 
      - Popule os <select> com tags <option> que contém as moedas que podem ser
        convertidas. "BRL" para real brasileiro, "EUR" para euro, "USD" para 
        dollar dos Estados Unidos, etc.
      - O option selecionado por padrão no 1º <select> deve ser "USD" e o option
        no 2º <select> deve ser "BRL";
      - O parágrafo com data-js="converted-value" deve exibir o resultado da 
        conversão de 1 USD para 1 BRL;
      - Quando um novo número for inserido no input com 
        data-js="currency-one-times", o parágrafo do item acima deve atualizar 
        seu valor;
      - O parágrafo com data-js="conversion-precision" deve conter a conversão 
        apenas x1. Exemplo: 1 USD = 5.0615 BRL;
      - O conteúdo do parágrafo do item acima deve ser atualizado à cada 
        mudança nos selects;
      - O conteúdo do parágrafo data-js="converted-value" deve ser atualizado à
        cada mudança nos selects e/ou no input com data-js="currency-one-times";
      - Para que o valor contido no parágrafo do item acima não tenha mais de 
        dois dígitos após o ponto, você pode usar o método toFixed: 
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    - Para obter as moedas com os valores já convertidos, use a Exchange rate 
      API: https://www.exchangerate-api.com/;
      - Para obter a key e fazer requests, você terá que fazer login e escolher
        o plano free. Seus dados de cartão de crédito não serão solicitados.
*/

const currencyOneEl = document.querySelector('[data-js="currency-one"]')
const currencyTwoEl = document.querySelector('[data-js="currency-two"]')
const currencyEl = document.querySelector('[data-js="currencies-container"]');


  const url = 'https://v6.exchangerate-api.com/v6/4a100b7cfa17f2816ee9f0aa/latest/USD'

const getErrorMessage = errorType =>({
  'unsupported-code': 'A moeda não existe em nosso banco de dados',
  'invalid-key' : 'quando sua chave de API não é válida',
  'inactive-account' : 'se o seu endereço de e-mail não foi confirmado',
  'quota-reached ' : ' quando sua conta atingir o número de solicitações permitidas pelo seu plano',

})[errorType] || 'Não foi possivel obter as informações'


const fetchExchangeRate = async() => {
  try {
    const response = await fetch (url)

    if (!response.ok){
      throw new Error ('Sua conexão falhou. Não foi possivel onter as informações.')
    }
    const exchangeRateData = await response.json()

    if (exchangeRateData.result === 'error'){
      throw new Error (getErrorMessage(exchangeRateData['error-type']))
    }
    return exchangeRateData
  } catch (err) {
    console.log (typeof err.message)
    alert (err.message)

    const div = document.createElement('div')
    const button = document.createElement('button')

    div.textContent = err.message
    div.classList.add('alert', 'alert-warning', 'alert-dimissible', 'fade', 'show')
    div.setAttribute('role','alert')
    button.classList.add('btn-close')
    button.setAttribute('type','button')
    button.setAttribute('aria-label', 'close')
    
    button.addEventListener('click', () => {
    div.remove()
    })
    
    div.appendChild (button)
    currencyEl.insertAdjacentElement ('afterend', div)

  }
}

const init = async () => {
  const exchangeRateData = await fetchExchangeRate()

  const options = Object.keys(exchangeRateData.conversion_rates)
    .map(currency => `<option>${currency}</option>`)
    .join('')

  console.log(options)

  currencyOneEl.innerHTML = options
  currencyTwoEl.innerHTML = options

}

init()

