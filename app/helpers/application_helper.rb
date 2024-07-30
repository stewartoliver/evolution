module ApplicationHelper
	def category_color_mapping
		{
			"rent" => "bg-red-500", 
			"utilities" => "bg-yellow-500", 
			"groceries" => "bg-green-500", 
			"transportation" => "bg-blue-500", 
			"entertainment" => "bg-purple-500", 
			"other" => "bg-gray-500"
		}
	end
end
