require("dotenv").config()
const output = {}
async function uploadFile() {
  const fileInput = document.querySelector('input[type="file"]');
  const formData = new FormData();
  // Check if a file is selected
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    formData.append("image", file);
    try {
      const response = await fetch(
        "http://localhost:8000/generate",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data.message)
      output.original = data.message['description'][0];
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          
          Authorization: `Bearer ${process.env.API_KEY_CLIENT}`
        },
        body: JSON.stringify({style: 'casual', text: data.message['description'][0]})
      };
      try {
        const response = await fetch('https://api.ai21.com/studio/v1/paraphrase', options);
        const mydata = await response.json();
        output.suggestions = mydata.suggestions;
        const original = document.querySelector("#original");
        await typeSentence(output.original, original);
        //document.querySelector("#original").innerText = output.original;
        output.suggestions.forEach(element => {
            let suggestion = document.createElement("li");
            suggestion.innerText = element.text
            document.querySelector("#suggestions").appendChild(suggestion)
        });
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
        console.log(error)
    }
  } else {
    alert("Please select an image file.");
  }
}



function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $(".image-upload-wrap").hide();

      $(".file-upload-image").attr("src", e.target.result);
      $(".file-upload-content").show();

      $(".image-title").html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    removeUpload();
  }
}

function removeUpload() {
  $(".file-upload-input").replaceWith($(".file-upload-input").clone());
  $(".file-upload-content").hide();
  $(".image-upload-wrap").show();
}
$(".image-upload-wrap").bind("dragover", function () {
  $(".image-upload-wrap").addClass("image-dropping");
});
$(".image-upload-wrap").bind("dragleave", function () {
  $(".image-upload-wrap").removeClass("image-dropping");
});

async function typeSentence(sentence, eleRef, delay = 100) {
    const letters = sentence.split("");
    let i = 0;
    while (i < letters.length) {
      await waitForMs(delay);
      $(eleRef).append(letters[i]);
      i++;
    }
    return;
  }
  
  function waitForMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }