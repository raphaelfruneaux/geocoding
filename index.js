const delay = require('./modules/sleep')

const main = async () => {
    console.log('Taking a break...')
    await delay(5000)
    console.log('Two second later')

    main2()
}

const main2 = async () => {
    console.log('[Main2] Taking a break...')
    await delay(2000)
    console.log('[Main2] Two second later')
}

const init = () => {
    main()
}

init()