
$(document).ready(function () {
    hljs.highlightAll();
  $("#addItemBtn").click(function () {
    var newItemHtml = `<div class="flex space-x-2 recipe">
                                    <input type="text" name="index" placeholder="ID"
                                        class="py-2 px-4 w-1/2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-700 text-white">
                                    <input type="text" name="name" placeholder="Nome"
                                        class="py-2 px-4 w-1/2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-700 text-white">
                                    <input type="text" name="amount" placeholder="Quant."
                                        class="py-2 px-4 w-1/2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-700 text-white">
                                </div>`;
    $("#itemsContainer").append(newItemHtml);
  });

  $("#recipeForm").submit(function (event) {
    event.preventDefault();

    // Processamento dos dados do formulário
    var formData = $(this).serializeArray();
    var cds = $(this).find("[name='cds']").val().split(";");
    var anim = $(this).find("[name='anim']").val();
    var items = [];
    var task = $("input[type='checkbox']").is(":checked");
    cds = Array.from(new Set(cds.map((cd) => `vector3(${cd})`)));
    anim = task ? `{task='${anim}'}` : `'${anim}'`;
    // Obter valores de cada item
    $(".item").each(function () {
      var name = $(this).find("[name='name']").val();
      var index = $(this).find("[name='index']").val();
      var amount = parseFloatValue($(this).find("[name='amount']").val());
      var weight = parseFloatValue($(this).find("[name='weight']").val(), 0.3);
      var recipe = [];

      $(this)
        .find(".recipe")
          .each(function () {
              var name = $(this).find("[name='name']").val();
              var index = $(this).find("[name='index']").val();
              var amount = parseFloatValue($(this).find("[name='amount']").val());
              var rec = `{ index = '${index}', name = ' ${name}', amount = ${parseInt(
                  amount
                  )}}`;
                  console.log(rec);
          recipe.push(rec);
        });
       // console.log(recipe);
      items.push(`['${index}'] = {
                ['name'] = '${name}',
                ['index'] = '${index}',
                ['amount'] = ${amount},
                ['weight'] = ${weight},
                ['recipe'] = {
                    ${recipe.join(",\n\t\t\t\t\t")},
                },
            }`);
    });

    var luaCode = `{
    ['cds'] = {
        ${cds.join(",\n\t\t")},
    },
    ['anim'] = ${anim},
    ['itens'] = {
        ${items.join(",\n")}
    }
}`;
    $("#output").empty();
    $("#output").removeAttr("data-highlighted")
    setTimeout(() => {
          $("#output").text(luaCode);
          hljs.highlightAll();
      }, 100);
  });
    
    // const highlightedCode = hljs.highlight('luaCode', {
    //   language: "lua",
    // }).value;
});

const parseFloatValue = (val, defaultValue = 1) => {
  if (!val) return defaultValue;
  return parseFloat(val);
};

const copyToClipboard = (element) => {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
};

document.querySelector("pre").addEventListener(
  "dblclick",
  function () {
    var selection = getSelection();
    var range = document.createRange();
    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);
  },
  false
);
