
const ITEMARR = [
    {
        itemId: 'energyDrink',
        standardPrice: 250
    },
    {
        itemId: 'hen',
        standardPrice: 500
    },
    {
        itemId: 'drill',
        standardPrice: 500
    },
    {
        itemId: 'cookingMix',
        standardPrice: 10
    }
];

let dataDisplay = [];


async function getData(myitemInfo) {
    const url = `https://pixels-server.pixels.xyz/v1/marketplace/item/itm_${myitemInfo.itemId}`
    const response = await fetch(url);
    const items = await response.json();
    let specificItem = items.listings.filter((e) => e.currency !== 'cur_pixel');
    specificItem = specificItem.sort((a,b)=> b.price - a.price )[specificItem.length - 1];
    const price = specificItem.price;
    const owner = items.ownerUsernames[specificItem.ownerId];
    dataDisplay.push({
        itemName: myitemInfo.itemId,
        standardPrice: myitemInfo.standardPrice,
        price: price,
        itemOwner: owner,
    })
    dataDisplay.sort((a, b) => {
        const nameA = a.itemName.toUpperCase(); // ignore upper and lowercase
        const nameB = b.itemName.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      
        // names must be equal
        return 0;
      });
    displayUI(dataDisplay)
  }

// init
ITEMARR.map((myitemInfo) => {
    getData(myitemInfo)
})

setInterval(() => {
    dataDisplay = [];
    ITEMARR.map((myitemInfo) => {
        getData(myitemInfo)
    })
}, 10000)

function displayUI(data) {
    let uiString = '';
    data.map((e) => {
        let buyclass = e.price < (e.standardPrice - 1 - e.standardPrice/100) ? 'buy' : '';
        uiString +=`
        <div class="card ${buyclass}">

            <div>${e.itemName}</div>
            <div>${e.price}</div>
            <div>${e.itemOwner}</div>
            <div>SP: ${e.standardPrice}</div>
        </div>`
    })
    document.getElementById('root').innerHTML = uiString;
}