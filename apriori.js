
var tranID = 0;

function transaction(t) {

    tranID = t;
    var html = '';

    for (let index = 1; index <= t; index++) {

        html += '<div class="form-group">' +
            '<label for="exampleFormControlInput1">Transactions ' + index + '</label>' +
            '<input type="text" class="form-control" name="' + index + '" id="' + index + '" placeholder="A,B,C,D,E">' +
            '</div>';
    }
    html += '<div class="form-row">' +
        '<div class="form-group col-md-6">' +
        '<label for="inputEmail4">Minimum Support</label>' +
        '<input type="number" min="10" class="form-control"  id="inputsup" placeholder="40%">' +
        '</div>' +
        '<div class="form-group col-md-6">' +
        '<label for="inputPassword4">Minimum Confidence</label>' +
        '<input type="number" min="10" class="form-control" id="inputcon" placeholder="50%">' +
        '</div>' +
        '</div>' +
        '<center>' +
        '<a class="btn btn-info btn-lg" onclick="apriori()" role="button"><i class="fab fa-artstation"></i> APRIORI</a> <a class="btn btn-warning btn-lg" href="index.html" role="button"><i class="fas fa-retweet"></i> RESET</a>'+
        '</center>' +
        '<hr class="my-4">';

    document.getElementById('tran').innerHTML = html;
    html=''
}

var data = []

function apriori() {

    for (var i = 1; i <= tranID; i++) {
        if (document.getElementById(i).value != '') {

            var array = document.getElementById(i).value.split(",");
            data.push({ item: array.map(str => str.replace(/\s/g, '')) });
        }
        console.log(data);

    }
    getApriori()
}
function getApriori() {

    var support = document.getElementById('inputsup').value /100 * tranID;
    var confidence = document.getElementById('inputcon').value
    console.log(support,confidence);
    
    var html1 = '<div class="form-group">'+
        '<label for="exampleFormControlTextarea1"><h3>Results</h3></label>'+
        '<textarea class="form-control" id="exampleFormControlTextarea1" cols="100" readonly="readonly" rows="15" >'

    var arr = [];
    data.forEach(function (data) {
        data.item.forEach(function (data2) {
            arr.push(data2)
        });
    });

    var sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
    var results = [];
    for (var i = 0; i < sorted_arr.length; i++) {
        if (sorted_arr[i + 1] != sorted_arr[i]) {
            results.push(sorted_arr[i]);
        }
    }
    console.log(results);
    const getAllSubsets =
        theArray => theArray.reduce(
            (subsets, value) => subsets.concat(
                subsets.map(set => [value, ...set])
            ),
            [[]]
        );
    var L = getAllSubsets(results);
    var itemset = []
    L.forEach(function (L) {
        var count = 0
        if (L != '') {
            data.forEach(function (data) {
                if (contains(data.item, L) == true) {
                    count += 1;
                }
            });
            if (count >= support)
                //console.log(L,"count",count);
                itemset.push({ item: L, sup: count })

        }
    });
    console.log(itemset);
    html1 += itemset.length +'  Large Itemsets (by Apriori): \n'
    itemset.forEach(function(set) {
        html1 += '{'+set.item +'}'+' ( Support: '+ (set.sup / tranID)*100+' % ) \n'; 
    });

    function contains(haystack, needles) {

        return needles.map(function (needle) {
            return haystack.indexOf(needle);
        }).indexOf(-1) == -1;
    }
var i=''
var count2 = 0
    itemset.forEach(function (set2) {

        if (set2.item.length > 1) {

            var subset = getAllSubsets(set2.item);
            subset.forEach(function (subset) {

                if (contains(set2.item, subset) && subset != '' && subset.length != set2.item.length) {

                    itemset.forEach(function (data) {

                        if (subset.sort().toString() == data.item.sort().toString() && (set2.sup / data.sup) * 100 >= confidence) {
                            var infor = removeFromArray(set2.item, subset)

                             i += '{'+subset.toString()+'}' + ' => '+'{'+ infor.toString() +'}'+ '%, Support: '+(data.sup/ tranID)*100+"  ( Confidence: "+ (set2.sup / data.sup)*100 +'% )\n'
                             count2++


                        }
                    });
                }
            });
        }
    });
    html1 += '\n'+count2+'  Association Rules'+'\n'+i+
             '</textarea>'+
             '</div>';

    function removeFromArray(original, remove) {
        return original.filter(value => !remove.includes(value));
    }

    document.getElementById('strong').innerHTML = html1;

    html1=''
}