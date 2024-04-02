<?php

namespace App\Http\Controllers\api\category;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Exception;
use Illuminate\Http\Request;

class indexController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = request()->user();
        $data = Category::all();
        return response()->json(['success'=>true,'user'=>$user,'data'=>$data]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $user = request()->user();
        $categories = Category::where('userId',$user->id)->get();
        return response()->json(['success'=>true, 'categories'=>$categories]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = request()->user();
        $all = $request->all();
        $create = Category::create($all);
        if($create){ return response()->json(['success'=>true, 'message'=>'Category Added Successfully']); }
        else { return response()->json(['success'=>false, 'message'=>'No Category Added']); }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = request()->user();
        $control = Category::where('id',$id)->where('userId',$user->id)->count();
        if ($control == 0){ return response()->json(['success'=>false, 'message'=>'The category does not belong to you',]);}

        $all = $request->all();
        $create = Category::update($all);
        if($create){ return response()->json(['success'=>true, 'message'=>'Category Added Successfully']); }
        else { return response()->json(['success'=>false, 'message'=>'No Category Added']); }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = request()->user();
        $control = Category::where('id',$id)->where('userId',$user->id)->count();
        if ($control == 0){ return response()->json(['success'=>false, 'message'=>'The category does not belong to you',]);}

        Category::where('id',$id)->delete();
        return response()->json(['success'=>true, 'message'=>'Category have been deleted successfully',]);
    }
}
