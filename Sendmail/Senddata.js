const fs = require('fs')
module.exports=senddata=(data)=>{
        var filedata= fs.readFileSync(__dirname+'/sendmail.html').toString()
        var middledata=''
        var data=JSON.parse(data)
        var total=0
        data.order.map((item)=>{
                total=total+parseInt(item.price)*parseInt(item.quantity)
        })
        data.order.map((item,index)=>{
                middledata=middledata+`<tr>
                <td style="padding: 7px; border-right: 2px solid black;">
                   ${parseInt(index)+1}
                </td>
                <td style="padding: 7px; border-right: 2px solid black;">
                    ${item.name}
                </td>
                <td style="padding: 7px; border-right: 2px solid black;">
                    ${item.price}
                </td>
                <td style="padding: 7px; border-right: 2px solid black;">
                    ${item.quantity}
                </td>
            </tr>`
        })
        var remaindata=`</tbody></table><p style="padding: 20px;margin-top:2px;margin-left: 40%;font-size: 30px;">Total:${total}$</p></body></html>`
        return filedata+middledata+remaindata;
}