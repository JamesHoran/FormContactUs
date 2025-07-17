import { useState } from "react";
import ServerResponse from "../../../types/serverResponse";

function FormContactUs(): React.ReactElement {
  const [errors, setErrors] = useState<Array<Record<string, string | number>>>([]);
  
  interface Options {
    method: string,
    body: FormData,
  }
  
  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    let formData: FormData = new FormData(event.currentTarget);

    const firstName: FormDataEntryValue | null = formData.get("firstName");
    const lastName: FormDataEntryValue | null = formData.get("lastName");
    const email: FormDataEntryValue | null = formData.get("email");
    const message: FormDataEntryValue | null = formData.get("message");
    let currentErrors: Array<Record<string, string | number>> = [];
    
    event.preventDefault();

    if(firstName && (firstName.toString().length > 100 || firstName.toString().length < 3)) {
      currentErrors.push({
        error: "First name must be between 3 and 100 characters.",
        id: 0
      })
    }
    if(lastName && (lastName.toString().length > 100 || lastName.toString().length < 3)) {
      currentErrors.push({
        error: "Last name must be between 3 and 100 characters.",
        id: 1
      })
    }
    if(email && (email.toString().length > 100 || email.toString().length < 4)) {
      currentErrors.push({
        error: "Email must be between 4 and 100 characters.",
        id: 2
      })
    }
    if(message && (message.toString().length > 500 || message && message.toString().length < 10)) {
      currentErrors.push({
        error: "Message must be between 10 and 500 characters.",
        id: 3
      })
    }

    setErrors(currentErrors);
    if(!Object.keys(currentErrors).length) {
      async function submitData(formData: FormData): Promise<void> {
        let response
        try {
          response = await fetch(
            "http://localhost:8082/api/form-contact-us",
            {
              method: "POST",
              body: formData,
            }
          );
        } catch (error) {
          window.alert("An error occurred connecting")
          console.error(`An error occurred connecting: ${error}`)
          return
        }

        if(response.ok) {
          try {
            let parsedRes: ServerResponse = await response.json();

            if(parsedRes.message) {
              window.alert(parsedRes.message)
            }
          } catch(error) {
            console.error(`Error parsing response: ${error}`)
          }
        } else if(!response.ok) {
          let message: string = "An error occurred. Please try again later"
          let error: unknown

          try {
            let parsedRes: ServerResponse = await response.json();

            if(parsedRes.error) {
              error = parsedRes.error
            }
            if(parsedRes.message) {
              message = parsedRes.message
            } else if(!parsedRes.error && !parsedRes.message && parsedRes.status) {
              error = `A ${parsedRes.status} error occurred. Please try again later`
            }
          } catch(error) {
            error = `Error parsing response: ${error}`
          }

          if(message) {
            window.alert(message)
          }
          if(error) {
            console.error(error)
          }
        } else {
          window.alert("An error occurred. Please try again later")
        }
      }
      submitData(formData)
    }
  }

  return (
    <div className="App h-full p-4">
      <div className="flex justify-center">
        <form className="w-full sm:w-md md:w-md xl:w-lg 2xl:w-2xl shadow-2xl h-min p-3 flex flex-col gap-3" onSubmit={handleSubmit}>
          <h2 className="text-center">Contact Us</h2>
          <div>
            <label>
              Name
              <div className="flex flex-col sm:flex-row gap-3">
                <input className="grow min-w-0 placeholder:text-gray-700" name="firstName" type='text' placeholder="First Name" aria-label="First Name" required></input>
                <input className="grow min-w-0 placeholder:text-gray-700" name="lastName" type='text' placeholder="Last Name" aria-label="Last Name" required></input>
              </div>
            </label>
          </div>
          <label className="flex flex-col">
            Email
            <input className="min-w-0" name="email" type='email' aria-label="Email" required></input>
          </label>
          <label className="flex flex-col">
            Message
            <textarea className="h-30" name="message" aria-label="Message" required></textarea>
          </label>
          <div className="text-red-500" role="alert">
            {errors.map(obj => {
              return <p key={obj.id}>{obj.error}</p>
            })}
          </div>
          <div className="w-auto flex justify-center">
            <button className="bg-blue-500 hover:cursor-pointer rounded-full py-1.5 px-5" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormContactUs;