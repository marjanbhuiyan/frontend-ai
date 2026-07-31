import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";



export type RegisterFormFieldValues = {
  firstName: string;
  lastName: string;
  // email: string;
  // age: number;
  // customerRole: string;
  // gender: "Female" | "Male" | "Other";
  // status: "Pending" | "Complete" | "Canceled";
  // contact: string;
  // country: string;
  // location: string;
  // aboutCustomer: string;
  // skills: string;
  // makeContactPublic: boolean;
  // availableToHire: boolean;
  // password: string;
  // confirmPassword: string;
  // storeName: string;
  // roleName: string;
};

type FormControlType = Control<RegisterFormFieldValues>;

interface RegisterFormProps {
  control: FormControlType;
}

function ToggleField<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: {
  control: Control<T>;
  name: FieldPathByValue<T, boolean>;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="mt-0.5 text-xs text-gray-400">{description}</p>
      </div>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <button
            type="button"
            onClick={() => field.onChange(!field.value)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              field.value ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                field.value ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        )}
      />
    </div>
  );
}

export default function RegisterForm({ control }: RegisterFormProps): React.JSX.Element {
  return (
    <div className="flex-1 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter First Name"
                  {...field}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Last Name"
                  {...field}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

    {/* /*
      <div className="grid grid-cols-2 gap-4">
       
        <FormField
          control={control}
          name="age"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-medium text-gray-700">Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="h-10 border-gray-200 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="customerRole"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-medium text-gray-700">Customer Role</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Role"
                  {...field}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Gender</Label>
        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={field.value === "Female"}
                      onChange={() => field.onChange("Female")}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Female
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={field.value === "Male"}
                      onChange={() => field.onChange("Male")}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={field.value === "Other"}
                      onChange={() => field.onChange("Other")}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Other
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-sm font-medium text-gray-700">Status</FormLabel>
            <FormControl>
              <Select value={field.value} onChange={(e) => field.onChange(e.target.value)} className="h-10">
                <option value="Pending">Pending</option>
                <option value="Complete">Complete</option>
                <option value="Canceled">Canceled</option>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="contact"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-medium text-gray-700">Contact</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Contact"
                  {...field}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-medium text-gray-700">Country</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Country"
                  {...field}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-sm font-medium text-gray-700">Location</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter Location"
                {...field}
                className="min-h-[80px] border-gray-200 text-sm placeholder:text-gray-400"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="aboutCustomer"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-sm font-medium text-gray-700">About Customer</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter Customer Information"
                {...field}
                className="min-h-[80px] border-gray-200 text-sm placeholder:text-gray-400"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="skills"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-sm font-medium text-gray-700">Skills</FormLabel>
            <FormControl>
              <Select value={field.value} onChange={(e) => field.onChange(e.target.value)} className="h-10">
                <option value="">Add Skills</option>
                <option value="design">Design</option>
                <option value="development">Development</option>
                <option value="marketing">Marketing</option>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
        <ToggleField
          control={control}
          name="makeContactPublic"
          label="Make Contact Info Public"
          description="Means that anyone viewing your profile will be able to see your contacts details"
        />
        <ToggleField
          control={control}
          name="availableToHire"
          label="Available to hire"
          description="Toggling this will let your teammates know that you are available for acquiring new projects"
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-800">Login Credentials</h3>
        <div className="grid grid-cols-2 gap-4">
           <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter Customer Email"
                  {...field}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter Password"
                    {...field}
                    className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-medium text-gray-700">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter Confirm Password"
                    {...field}
                    className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-800">Store Access</h3>
        <FormField
          control={control}
          name="storeName"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-medium text-gray-700">Store Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Store Name"
                  {...field}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-800">Store Role</h3>
        <FormField
          control={control}
          name="roleName"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-medium text-gray-700">Role Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Role Name"
                  {...field}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    */}
    </div>
  );
}
