module.exports = function main(inputs) {
    let count = sta(inputs);   //获取商品信息
    let allItems = loadAllItems();
    let promotions = loadPromotions();
    let sum = 0.00;
    let primeCost = 0.00;
//给count数组中除数量以外的信息赋值,并计算单个商品总价
    count.forEach(item => {
        allItems.forEach(data => {
            if (item.key === data.barcode) {
                item.name = data.name;
                item.unit = data.unit;
                item.price = parseFloat(data.price).toFixed(2);
                item.subtotal = (parseFloat(item.price) * item.count);
            }
        })
        //计算总价格
        primeCost += item.subtotal;
        //计算优惠商品，减去优惠费用
        promotions[0].barcodes.forEach(data => {
            if (isDiscount(item, data)) {
                item.subtotal = item.price * (item.count - 1)
                item.Discount = true;
            }
        })
        //计算优惠后费用
        sum += (item.subtotal);
    })
    let expectText = splicedCharacter(count, sum, primeCost);
//输出
    console.log(expectText);
}
function sta(inputs) {
    let array_key = [];
    let count = [];
//拆分输入，形成新的数组
    inputs.forEach(item => {
        array_key.push(item.split("-"))
    })
    //遍历数组，判断二位数组的每个末尾是否为空，如若是，那么赋值为1
    array_key.forEach(data => {
        if (data[1] === undefined)
            data[1] = 1
    })
    //遍历数组array_key，判断是否能在count数组中找到与商品编号值相等，如若不能，执行添加操作
    array_key.forEach(data => {
        if (!count.find(element => element.key === data[0])) {
            count.push({key: data[0], count: 0, name: '', unit: '', price: 0.00, subtotal: 0.00,Discount:false})
        }
    })
    //遍历count与array_key数组，当输入的商品编号与商品信息匹配时，数量+1
    count.forEach(item => {
        array_key.forEach(data => {
            if (item.key === data[0]) {
                item.count += parseFloat(data[1])
            }
        })
    })

    return count;
}
//判断优惠商品规则
function isDiscount(item, data) {

    return item.key === data && item.count >= 2;
}
//输出
function splicedCharacter(count, sum, primeCost) {
    let expectText = "";

    expectText += `***<没钱赚商店>购物清单***`;
    count.forEach(item => {
        expectText += `\n名称：${item.name}，数量：${item.count}${item.unit}，单价：${item.price}(元)，小计：${(item.subtotal).toFixed(2)}(元)`;
    })
    expectText += `\n----------------------\n挥泪赠送商品：\n`;
    count.forEach(item =>{
        if(item.Discount){
            expectText += `名称：${item.name}，数量：1${item.unit}\n`;
        }
    })
    expectText += `----------------------\n总计：${sum.toFixed(2)}(元)\n节省：${(primeCost - sum).toFixed(2)}(元)\n**********************`;

    return expectText;
}


